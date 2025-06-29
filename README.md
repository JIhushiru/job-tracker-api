# Job Tracker API

An asynchronous job application tracker built with FastAPI, PostgreSQL, Redis, MongoDB, and Celery — containerized using Docker.

---

##  Features

- CRUD operations for job applications
- Background email simulation using Celery + Redis
- Analytics report with Pandas
- MongoDB integration for NoSQL logging
- Full Docker-based stack (API, Worker, Postgres, Redis, Mongo)
- Async request handling with FastAPI
- Ready for production / deployment

---

## Tech Stack

- **FastAPI** (Python)
- **PostgreSQL** via SQLModel
- **Redis** (Celery broker/backend)
- **MongoDB** (NoSQL logs)
- **Pandas** (report generation)
- **Docker + Docker Compose**

---

## Getting Started

### Prerequisites

- Docker + Docker Compose installed

### Run the stack:

```bash
docker-compose up --build
