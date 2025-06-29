from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from sqlmodel import Session, select
from typing import Optional, List
from fastapi import HTTPException, Query
from app.schemas import Job
from app.database import get_session, init_db
from app.worker import send_application_email
from app.mongo_logger import log_job_to_mongo
from fastapi.responses import JSONResponse
from app.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)
from app.schemas import User
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import StreamingResponse
from app.schemas import JobHistory
from app.constants import VALID_STATUS_TRANSITIONS
import io
import pandas as pd


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

"""
GET /jobs -> all jobs
GET /jobs?status={status} -> filter by status
GET /jobs?company={company} -> filter by company
GET /jobs?company={company}&status={status} -> filter by status and company
"""


@app.get("/jobs", response_model=List[Job])
def get_jobs(
    status: Optional[str] = Query(default=None),
    company: Optional[str] = Query(default=None),
    sort_by: Optional[str] = Query(
        default=None, pattern="^(company|status|date_applied)$"
    ),
    order: Optional[str] = Query(default="asc", pattern="^(asc|desc)$"),
    session: Session = Depends(get_session),
    user: str = Depends(get_current_user),
):
    query = select(Job).where(Job.user_id == user.id)

    if status:
        query = query.where(Job.status == status)
    if company:
        query = query.where(Job.company == company)
    if sort_by:
        sort_column = getattr(Job, sort_by)
        if order == "desc":
            sort_column = sort_column.desc()
        query = query.order_by(sort_column)

    return session.exec(query).all()


# Update Job #
@app.put("/jobs/{job_id}", response_model=Job)
def update_job(job_id: int, updated: Job, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
    if not job or job.user_id != updated.user_id:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.status != updated.status or job.notes != updated.notes:
        allowed_transitions = VALID_STATUS_TRANSITIONS.get(job.status, [])
        if updated.status not in allowed_transitions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status transition from '{job.status}' to '{updated.status}'",
            )

        # Save to history if valid
        history = JobHistory(
            job_id=job.id,
            previous_status=job.status,
            new_status=updated.status,
        )
        session.add(history)
    if updated.status not in ["applied", "interviewing", "offer", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid status. Must be one of: applied, interviewing, offer, rejected",
        )

    job.company = updated.company
    job.position = updated.position
    job.status = updated.status
    job.notes = updated.notes
    session.add(job)
    session.commit()
    session.refresh(job)
    return job


@app.get("/jobs/{job_id}/history", response_model=List[JobHistory])
def get_job_history(job_id: int, session: Session = Depends(get_session)):
    history = session.exec(select(JobHistory).where(JobHistory.job_id == job_id)).all()
    return history


# Delete Job #
@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    session.delete(job)
    session.commit()
    return {"message": f"Job {job_id} deleted"}


# Add Job #
@app.post("/jobs", response_model=Job)
def add_job(
    job: Job,
    session: Session = Depends(get_session),
    user: str = Depends(get_current_user),
):
    job.user_id = user.id
    existing_job = session.exec(
        select(Job).where(
            Job.company == job.company,
            Job.position == job.position,
        )
    ).first()
    if existing_job:
        raise HTTPException(status_code=400, detail="Job already exists")
    if job.status not in ["applied", "interviewing", "offer", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid status. Must be one of: applied, interviewing, offer, rejected",
        )
    session.add(job)
    session.commit()
    session.refresh(job)
    log_job_to_mongo(job.model_dump())
    send_application_email.delay(job.company, job.position)
    return job


# Generate Report #
@app.get("/report")
def generate_report(session: Session = Depends(get_session)):
    jobs = session.exec(select(Job)).all()
    df = pd.DataFrame([job.model_dump() for job in jobs])
    status_counts = df["status"].value_counts().to_dict()
    return JSONResponse(content=status_counts)


@app.post("/auth/signup")
def signup(
    user: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)
):
    existing = session.exec(select(User).where(User.username == user.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pw = get_password_hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_pw)
    session.add(new_user)
    session.commit()
    return {"message": "User created"}


@app.post("/auth/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/profile")
def read_profile(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello, {current_user}"}


@app.get("/export")
def export_jobs(
    session: Session = Depends(get_session), user: User = Depends(get_current_user)
):
    jobs = session.exec(select(Job).where(Job.user_id == user.id)).all()
    if not jobs:
        raise HTTPException(status_code=404, detail="No jobs found")

    df = pd.DataFrame([job.model_dump() for job in jobs])
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    stream.seek(0)
    return StreamingResponse(
        stream,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=jobs.csv"},
    )


@app.get("/jobs/search", response_model=List[Job])
def search_jobs(
    query: str,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    stmt = select(Job).where(
        Job.user_id == user.id,
        (Job.company.ilike(f"%{query}%"))
        | (Job.position.ilike(f"%{query}%"))
        | (Job.notes.ilike(f"%{query}%")),
    )
    return session.exec(stmt).all()


@app.get("/")
def root():
    return {"message": "Job Tracker API is running"}
