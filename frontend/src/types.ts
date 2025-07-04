export type Job = {
    id: number;
    company: string;
    position: string;
    status: "applied" | "interviewing" | "offer" | "rejected";
    notes: string | null;
    date_applied?: string | null;
    user_id: number;
}

export type JobCreate = Omit<Job, "id" | "user_id">;