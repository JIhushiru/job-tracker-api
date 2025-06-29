from pymongo import MongoClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongo:27017/")
client = MongoClient(MONGO_URL)
db = client["jobtracker"]
log_collection = db["logs"]

def log_job_to_mongo(job_data: dict):
    log_collection.insert_one(job_data)
