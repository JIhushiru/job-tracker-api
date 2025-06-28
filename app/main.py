from fastapi import FastAPI
from typing import List
from app.schemas import Job

app = FastAPI()

# In-memory database 
jobs_db: List[Job] = []

@app.get("/")
def root():
    return {"message": "Job Tracker API is running"}

@app.get("/jobs", response_model=List[Job])
def get_jobs():
    return jobs_db

@app.post("/jobs", response_model=Job)
def add_job(job: Job):
    jobs_db.append(job)
    return job