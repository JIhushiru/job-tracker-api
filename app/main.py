from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from sqlmodel import Session, select
from typing import Optional,List
from fastapi import HTTPException, Query
from app.schemas import Job
from app.database import get_session, init_db
from app.worker import send_application_email


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

'''
GET /jobs -> all jobs
GET /jobs?status={status} -> filter by status
GET /jobs?company={company} -> filter by company
GET /jobs?company={company}&status={status} -> filter by status and company
'''
@app.get("/jobs", response_model=List[Job])
def get_jobs(
    status: Optional[str] = Query(default=None),
    company: Optional[str] = Query(default=None),
    session: Session = Depends(get_session),
):
    query = select(Job)

    if status:
        query = query.where(Job.status == status)
    if company:
        query = query.where(Job.company == company)

    return session.exec(query).all()


# Update Job #
@app.put("/jobs/{job_id}", response_model=Job)
def update_job(job_id: int, updated: Job, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.company = updated.company
    job.position = updated.position
    job.status = updated.status
    job.notes = updated.notes
    session.add(job)
    session.commit()
    session.refresh(job)
    return job

# Delete Job #
@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    session.delete(job)
    session.commit()
    return {"message": f"Job {job_id} deleted"}
@app.get("/jobs", response_model=List[Job])
def get_jobs(session: Session = Depends(get_session)):
    return session.exec(select(Job)).all()

@app.post("/jobs", response_model=Job)
def add_job(job: Job, session: Session = Depends(get_session)):
    session.add(job)
    session.commit()
    session.refresh(job)
    send_application_email.delay(job.company, job.position)
    return job

@app.get("/")
def root():
    return {"message": "Job Tracker API is running"}
