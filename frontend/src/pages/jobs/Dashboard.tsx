import { useEffect, useState } from "react";
import { getJobs } from "../../services/jobService";
import type { Job } from "../../types";
import JobTable from "./JobTable";
import LogoutButton from "../../button/LogoutButton";
import AddJobForm from "./AddJobForm"; 
import SocialAccount from "../social/SocialAccount";
import EditJobForm from "./EditJobForm";
import SearchBar from "../../components/SearchBar";
import { searchJobs } from "../../services/jobService";

export default function Dashboard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [jobBeingEdited, setJobBeingEdited] = useState<Job | null>(null);
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

    const handleSearch = async (query: string) => {
    try {
        if (query.trim() === "") {
            const data = await getJobs();
            setJobs(data);
        } else {
            const data = await searchJobs(query);
            setJobs(data);
        }
    } catch (err: any) {
        setError("Search failed");
    }
};

    const handleDelete = (jobId: number) => {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
    };

    const handleJobAdded = (newJob: Job) => {
        setJobs((prev) => [...prev, newJob]);
        setShowAddModal(false);
    };

    const handleJobUpdated = (updatedJob: Job) => {
        setJobs((prev) =>
            prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
        );
    };

    return (
        <>
        <div>
            <div className="job-application">MY JOB APPLICATIONS</div>
            <SearchBar onSearch={handleSearch} />
            {error ? (
                <button onClick={() => window.location.href = "/"}>Sign In</button>
            ) : (
                <>
                    {jobs.length === 0 ? (
                        <p>No jobs found.</p>
                    ) : (
                        <JobTable
                        jobs={jobs}
                        onDelete={handleDelete}
                        onEdit={setJobBeingEdited}
                        />
                    )}
                    <div className="bottom-buttons">
                    <button className="AddJobbtn" onClick={() => setShowAddModal(true)}>
                        Add Job
                    </button>
                    <span style={{margin: "0 8px"}}></span>
                    <LogoutButton />
                    </div>

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
                    {jobBeingEdited && (
                    <div className="modal-overlay" onClick={(e) => {
                        if (e.target === e.currentTarget) setJobBeingEdited(null);
                    }}>
                        <div className="modal">
                        <button className="close-btn" onClick={() => setJobBeingEdited(null)}>X</button>
                        <EditJobForm
                            job={jobBeingEdited}
                            onUpdated={(updatedJob) => {
                            handleJobUpdated(updatedJob);
                            setJobBeingEdited(null);
                            }}
                            onClose={() => setJobBeingEdited(null)}
                        />
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
