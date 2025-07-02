import React from "react";
import type { Job } from "../../types";
import { deleteJob } from "../../services/jobService";

type JobTableProps = {
  jobs: Job[];
  onDelete: (jobId: number) => void; // To update parent state
};

const JobTable: React.FC<JobTableProps> = ({ jobs, onDelete }) => {
  const handleDelete = async (jobId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    try {
      await deleteJob(jobId);
      onDelete(jobId); // remove from UI
    } catch (error) {
      alert("Failed to delete job");
    }
  };

  return (
    <div className ="jobTable">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Date Applied</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className = "deleteColumn">
                  <button onClick={() => handleDelete(job.id)} className="deleteContainer">
                    <img src="/icons/delete.svg" alt="Delete" className="deleteButton"/>
                  </button>
              </td>
              <td>{job.company}</td>
              <td>{job.position}</td>
              <td>{job.status}</td>
              <td>{job.notes}</td>
              <td>{job.date_applied?.split("T")[0] || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
