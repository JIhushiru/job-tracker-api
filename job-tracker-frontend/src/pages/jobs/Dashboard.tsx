import { useEffect, useState } from "react";
import { getJobs } from "../../services/jobService";
import type { Job } from "../../types"
import JobTable from "./JobTable";
import { Link } from "react-router-dom";
import LogoutButton from "../../button/LogoutButton";

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

    const handleDelete = (jobId: number) => {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
    };

    return (
        <div>
            <h1>MY JOB APPLICATIONS</h1>
            {error ? (
                <Link to="/">
                    <button>Sign In</button>
                </Link>
            ) : (
                <>
                    {jobs.length === 0 ? (
                        <p>No jobs found.</p>
                    ) : (
                        <JobTable jobs={jobs} onDelete={handleDelete}/>
                    )}
                    <Link to="/add-job">
                        <button className="AddJobbtn">Add Job</button>
                    </Link>
                    <span>  </span>
                    <LogoutButton />
                </>
            )}
        </div>
    );
}