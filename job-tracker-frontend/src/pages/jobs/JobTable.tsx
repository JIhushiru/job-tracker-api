import React from "react";
import type { Job } from "../../types";

type JobTableProps = {
  jobs: Job[];
};

const JobTable: React.FC<JobTableProps> = ({ jobs }) => {
  return (
    <div>
      <h2>Job Listings</h2>
      <table>
        <thead>
          <tr>
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
