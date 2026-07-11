export declare class UpdateDriftStatusDto {
    status: "open" | "acknowledged" | "resolved" | "ignored";
}
export declare class UpdateRiskStatusDto {
    status: "identified" | "assessed" | "mitigating" | "accepted" | "transferred" | "closed";
}
export declare class UpdateRemediationStatusDto {
    status: "open" | "in_progress" | "blocked" | "completed" | "cancelled";
}
