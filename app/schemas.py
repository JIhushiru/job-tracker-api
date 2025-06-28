from pydantic import BaseModel
from typing import Optional

class Job(BaseModel):
    id: int
    company: str
    position: str
    status: str
    notes: Optional[str] = None
    date_applied: Optional[str] = None