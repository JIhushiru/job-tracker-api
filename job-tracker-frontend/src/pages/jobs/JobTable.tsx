import React from "react";
import type { Job } from "../../types";
import { deleteJob } from "../../services/jobService";
import { useState } from "react";
type JobTableProps = {
  jobs: Job[];
  onDelete: (jobId: number) => void; // To update parent state
};

const JobTable: React.FC<JobTableProps> = ({ jobs, onDelete }) => {
  const [sortBy, setSortBy] = useState<keyof Job | "notesLength">("date_applied")
  const [sortOrder, setSortOrder] = useState<"asc" |"desc">("asc");


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

  const handleSort = (column: keyof Job | "notesLength") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedJobs = [...jobs].sort((a,b)=> {
    let valA: string | number | undefined = a[sortBy as keyof Job];
    let valB: string | number | undefined = b[sortBy as keyof Job];

    if (sortBy === "notesLength"){
      valA = a.notes.length;
      valB = b.notes.length;
    } else if (sortBy === "date_applied"){
      valA = a.date_applied ? new Date(a.date_applied).getTime() : 0;
      valB = b.date_applied ? new Date(b.date_applied).getTime() : 0;
    }

    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc"
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    } else {
      return sortOrder === "asc"
        ? (Number(valA) || 0) - (Number(valB) || 0)
        : (Number(valB) || 0) - (Number(valA) || 0);
    }
  });

  const sortIndicator = (col: string) =>
    sortBy === col ? (sortOrder === "asc" ? "↑" : "↓") : "";

  return (
    <div className ="jobTable">
      <table>
        <thead>
          <tr>
            <th></th>
            <th className = "header" onClick={() => handleSort("company")}>Company{sortIndicator("company")}</th>
            <th className = "header" onClick={() => handleSort("position")}>Position{sortIndicator("position")}</th>
            <th className = "header" onClick={() => handleSort("status")}>Status{sortIndicator("status")}</th>
            <th className = "header" onClick={() => handleSort("notesLength")}>Notes{sortIndicator("notesLength")}</th>
            <th className = "header" onClick={() => handleSort("date_applied")}>Date Applied{sortIndicator("date_applied")}</th>
          </tr>
        </thead>
        <tbody>
          {sortedJobs.map((job) => (
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
