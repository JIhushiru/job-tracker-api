from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company: str
    position: str
    status: str
    notes: Optional[str] = None
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    hashed_password: str


class JobHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: int = Field(foreign_key="job.id")
    previous_status: Optional[str] = None
    new_status: Optional[str] = None
    previous_notes: Optional[str] = None
    new_notes: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
