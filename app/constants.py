VALID_STATUS_TRANSITIONS = {
    "applied": ["interviewing", "rejected"],
    "interviewing": ["offer", "rejected"],
    "offer": ["accepted", "rejected"],
    "accepted": [],
    "rejected": [],
}
