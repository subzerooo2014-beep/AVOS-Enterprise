export declare class UpdateOperationalStatusDto {
    status: "planned" | "pending" | "active" | "paused" | "blocked" | "completed" | "cancelled" | "failed";
    output?: Record<string, unknown>;
}
