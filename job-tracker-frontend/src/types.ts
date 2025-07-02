export type Job = {
    id: number;
    company: string;
    position: string;
    status: "applied" | "interviewing" | "offer" | "rejected";
    notes: string;
    date_applied?: string;
    user_id: number;
}