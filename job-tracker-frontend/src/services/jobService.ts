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
