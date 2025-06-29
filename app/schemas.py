from sqlmodel import SQLModel, Field
from typing import Optional


class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company: str
    position: str
    status: str
    notes: Optional[str] = None
