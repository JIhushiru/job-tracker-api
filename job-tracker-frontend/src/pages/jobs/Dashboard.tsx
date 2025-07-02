import { useEffect, useState } from "react";
import { getJobs } from "../../services/jobService";
import type { Job } from "../../types";
import JobTable from "./JobTable";
import LogoutButton from "../../button/LogoutButton";
import AddJobForm from "./AddJobForm"; 
import SocialAccount from "../social/SocialAccount";

export default function Dashboard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false); 

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getJobs();
                setJobs(data);
            } catch (err: any) {
                setError("Failed to load jobs");
            }
        };
        fetchJobs();
    }, []);

    const handleDelete = (jobId: number) => {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
    };

    const handleJobAdded = (newJob: Job) => {
        setJobs((prev) => [...prev, newJob]);
        setShowAddModal(false);
    };

    return (
        <>
        <div>
            <h1>MY JOB APPLICATIONS</h1>
            {error ? (
                <button onClick={() => window.location.href = "/"}>Sign In</button>
            ) : (
                <>
                    {jobs.length === 0 ? (
                        <p>No jobs found.</p>
                    ) : (
                        <JobTable jobs={jobs} onDelete={handleDelete} />
                    )}

                    <button className="AddJobbtn" onClick={() => setShowAddModal(true)}>
                        Add Job
                    </button>
                    <span style={{margin: "0 8px"}}></span>
                    <LogoutButton />

                    {showAddModal && (
                        <div className="modal-overlay"
                        onClick={(e)=>{ // For clicking outside
                            if (e.target === e.currentTarget) {
                                setShowAddModal(false); 
                            }
                        }}>
                            <div className="modal">
                                <button className="close-btn" onClick={() => setShowAddModal(false)}>X</button>
                                <AddJobForm onJobAdded={handleJobAdded} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
        <SocialAccount />
        </>
    );
}
