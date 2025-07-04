import axios from "./api";
import type { Job, JobCreate } from "../types";

export const getJobs = async (): Promise<Job[]> => {
  const response = await axios.get("/jobs", {
    withCredentials: true,
  });
  return response.data;
};

export const createJob = async (job: JobCreate): Promise<Job> => {
  const response = await axios.post("/jobs", job, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
};

export const deleteJob = async (jobId: number): Promise<void> => {
  await axios.delete(`/jobs/${jobId}`, {
    withCredentials: true,
  });
};

export const updateJob = async (id: number, updatedJob: Job): Promise<Job> => {
  const response = await axios.put(`/jobs/${id}`, updatedJob, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
};

export const searchJobs = async (query: string): Promise<Job[]> => {
  const response = await axios.get("/jobs", {
    params: { search: query },
    withCredentials: true,
  });
  return response.data;
};