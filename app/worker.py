from celery import Celery
import time

celery_app = Celery(
    "worker",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0"
)

@celery_app.task
def send_application_email(company: str, position: str):
    print(f"Sending email for job at {company} ({position})...")
    time.sleep(5)
    print(f"Email sent to HR@{company.lower()}.com about {position}")
