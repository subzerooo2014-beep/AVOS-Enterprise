export declare class CreateDriftEventDto {
    domain: string;
    resource: string;
    description: string;
    severity: "informational" | "low" | "medium" | "high" | "critical";
    previousState?: unknown;
    currentState?: unknown;
    metadata?: Record<string, unknown>;
}
