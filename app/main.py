from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from sqlmodel import SQLModel, Session, select
from typing import List

from app.schemas import Job
from app.database import engine, get_session, init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/")
def root():
    return {"message": "Job Tracker API is running"}


@app.get("/jobs", response_model=List[Job])
def get_jobs(session: Session = Depends(get_session)):
    return session.exec(select(Job)).all()


@app.post("/jobs", response_model=Job)
def add_job(job: Job, session: Session = Depends(get_session)):
    session.add(job)
    session.commit()
    session.refresh(job)
    return job
