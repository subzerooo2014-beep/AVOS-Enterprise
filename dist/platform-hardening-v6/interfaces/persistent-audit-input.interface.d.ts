export interface PersistentAuditInput {
    eventType: string;
    severity: string;
    action: string;
    message: string;
    actor?: string;
    correlationId?: string;
    traceId?: string;
    method?: string;
    path?: string;
    statusCode?: number;
    metadata?: Record<string, unknown>;
}
