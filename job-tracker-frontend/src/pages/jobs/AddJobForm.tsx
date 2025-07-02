import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../services/jobService";

const statusOptions = ["applied", "interviewing", "offer", "rejected"] as const;
type JobStatus = typeof statusOptions[number];

export default function AddJobForm() {
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [status, setStatus] = useState<JobStatus>("applied");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createJob({ company, position, status, notes, user_id: 0});
            navigate("/jobs");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to add job");
        }
    };

    return (
        <div>
            <h2>Add Job</h2>
            <form onSubmit={handleSubmit}>
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" required />
                <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position" required />
                <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)}>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                </select>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
                <br />
                <button type="submit">Add Job</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}
