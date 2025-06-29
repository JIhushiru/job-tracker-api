from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.exc import OperationalError
import os
import time

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./jobs.db")
engine = create_engine(DATABASE_URL, echo=True)


def get_session():
    with Session(engine) as session:
        yield session


def init_db():
    for _ in range(10):
        try:
            SQLModel.metadata.create_all(engine)
            print("Database initialized successfully")
            break
        except OperationalError:
            print("Database not ready, retrying in 2 seconds...")
            time.sleep(2)
