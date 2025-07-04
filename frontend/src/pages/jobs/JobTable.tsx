import React from "react";
import type { Job } from "../../types";
import { deleteJob } from "../../services/jobService";
import { useState } from "react";
import "./JobTable.css";
import { useNavigate } from "react-router-dom";

type JobTableProps = {
  jobs: Job[];
  onDelete: (jobId: number) => void; // To update parent state
  onEdit: (job: Job) => void;
};

const JobTable: React.FC<JobTableProps> = ({ jobs, onDelete, onEdit }) => {
  const [sortBy, setSortBy] = useState<keyof Job | "notesLength">("date_applied")
  const [sortOrder, setSortOrder] = useState<"asc" |"desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10; 
  const navigate = useNavigate();

  const handleDelete = async (jobId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    try {
      await deleteJob(jobId);
      onDelete(jobId); // remove from Dashboard's job list

      const totalJobsAfterDelete = jobs.length - 1;
      const newTotalPages = Math.ceil(totalJobsAfterDelete / jobsPerPage);

      // If we just deleted the last item on the last page, move to previous page
      if (currentPage > newTotalPages) {
        setCurrentPage(Math.max(newTotalPages, 1));
      }
    } catch (error) {
      alert("Failed to delete job");
      alert("Token expired or invalid. Please log in again.");
      navigate("/");
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
    let valA: string | number | undefined = a[sortBy as keyof Job] ?? undefined;
    let valB: string | number | undefined = b[sortBy as keyof Job] ?? undefined;

    if (sortBy === "notesLength"){
      valA = (a.notes ?? "").length;
      valB = (b.notes ?? "").length;
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

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <>
    <div className ="job-table">
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
        <tbody className="job-table-body">
          {currentJobs.map((job) => (
            <tr key={job.id}>
              <td className = "button-column">
                  <button onClick={() => handleDelete(job.id)} className="deleteContainer">
                    <img src="/icons/delete.svg" alt="Delete" className="deleteButton"/>
                  </button>
                  <button onClick={() => onEdit(job)} className="updateContainer">
                    <img src="/icons/edit.svg" alt="Edit" className="updateButton" />
                  </button>
              </td>
              <td>{job.company}</td>
              <td>{job.position}</td>
              <td>
                <span className={`status-badge status-${job.status.toLowerCase()}`}>
                  {job.status}
                </span>
              </td>
              <td>{job.notes || "-"}</td>
              <td>{job.date_applied?.split("T")[0] || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  {Math.ceil(sortedJobs.length / jobsPerPage) > 1 && (
    <div className="pagination-controls">
      {Array.from({ length: Math.ceil(sortedJobs.length / jobsPerPage) }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => setCurrentPage(num)}
          className={num === currentPage ? "active-page" : ""}
        >
          {num}
        </button>
      ))}
    </div>
  )}
  </>
  );
};

export default JobTable;
