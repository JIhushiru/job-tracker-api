import axios from "./api";
import type { Job } from "../types";

export const getJobs = async (): Promise<Job[]> => {
  const token = localStorage.getItem("token");
  const response = await axios.get("/jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createJob = async (
  job: Omit<Job, "id" | "date_applied">
): Promise<Job> => {
  const token = localStorage.getItem("token");
  const response = await axios.post("/jobs", job, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
