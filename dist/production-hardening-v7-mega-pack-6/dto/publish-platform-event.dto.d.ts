export declare class PublishPlatformEventDto {
    eventType: string;
    source: string;
    severity: "informational" | "low" | "medium" | "high" | "critical";
    entityType?: string;
    entityId?: string;
    payload: Record<string, unknown>;
    correlationId?: string;
    causationId?: string;
}
