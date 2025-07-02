import { useEffect, useState } from "react";
import { getJobs } from "../../services/jobService";
import type { Job } from "../../types"

export default function Dashboard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getJobs();
                setJobs(data);
            } catch(err:any){
                setError("Failed to load jobs");
            }
        };
        fetchJobs();
    }, []);

    return (
        <div>
        <h2>My Job Applications</h2>
        {error && <p>{error}</p>}
        {jobs.length === 0 ? (
            <p>No jobs yet.</p>
        ) : (
            <ul>
            {jobs.map((job) => (
                <li key={job.id}>
                <strong>{job.position}</strong> @ {job.company} -{" "}
                {job.status.toUpperCase()}
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}