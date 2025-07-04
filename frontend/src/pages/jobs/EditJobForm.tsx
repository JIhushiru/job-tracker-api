import { useState } from "react";
import { updateJob } from "../../services/jobService";
import type { Job } from "../../types";
import { useNavigate } from "react-router-dom";
const statusOptions = ["applied", "interviewing", "offer", "rejected"] as const;
type JobStatus = typeof statusOptions[number];

type Props = {
  job: Job;
  onUpdated: (job: Job) => void;
  onClose: () => void;
};

export default function EditJobForm({ job, onUpdated, onClose}: Props) {
  const [company, setCompany] = useState(job.company);
  const [position, setPosition] = useState(job.position);
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [notes, setNotes] = useState(job.notes);
  const [dateApplied, setDateApplied] = useState(job.date_applied?.split("T")[0] || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateJob(job.id, {
        ...job,
        company,
        position,
        status,
        notes,
        date_applied: dateApplied || undefined,
      });
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.detail || "Failed to update job";
      setError(message);
      if (
        err.response?.status === 401 || // Unauthorized
        message.toLowerCase().includes("invalid token")
      ) {
        alert("Token expired or invalid. Please log in again.");
        navigate("/");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Job</h3>
      <input value={company} onChange={(e) => setCompany(e.target.value)} required />
      <input value={position} onChange={(e) => setPosition(e.target.value)} required />
      <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)}>
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      <textarea value={notes ?? ""} onChange={(e) => setNotes(e.target.value)} />
      <input type="date" value={dateApplied} onChange={(e) => setDateApplied(e.target.value)} />
      <br />
      <button type="submit">Save</button>
      <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
