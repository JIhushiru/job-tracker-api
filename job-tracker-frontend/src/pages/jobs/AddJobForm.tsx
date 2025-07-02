import { useState } from "react";
import { createJob } from "../../services/jobService";
import type { Job } from "../../types";
import { useNavigate } from "react-router-dom";

const statusOptions = ["applied", "interviewing", "offer", "rejected"] as const;
type JobStatus = typeof statusOptions[number];

type Props = {
  onJobAdded: (job: Job) => void;
};

export default function AddJobForm({ onJobAdded }: Props) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<JobStatus>("applied");
  const [notes, setNotes] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newJob = await createJob({
        company,
        position,
        status,
        notes,
        user_id: 0,
        date_applied: dateApplied || undefined,
      });
      onJobAdded(newJob);
    } catch (err: any) {
      const message = err.response?.data?.detail || "Failed to add job";
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
      <h2>Add Job</h2>
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company"
        required
      />
      <input
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        placeholder="Position"
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as JobStatus)}
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
      />
      <input
        type="date"
        value={dateApplied}
        onChange={(e) => setDateApplied(e.target.value)}
        placeholder="Date Applied (optional)"
      />
      <br />
      <button type="submit">Add Job</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
