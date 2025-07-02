VALID_STATUS_TRANSITIONS = {
    "applied": ["applied", "interviewing", "rejected"],
    "interviewing": ["interviewing", "offer", "rejected"],
    "offer": ["offer", "accepted", "rejected"],
    "accepted": ["accepted"],
    "rejected": ["rejected"],
}
