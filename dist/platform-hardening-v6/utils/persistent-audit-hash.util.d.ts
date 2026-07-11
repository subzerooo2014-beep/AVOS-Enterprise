export declare class PersistentAuditHashUtil {
    static create(input: {
        sequence: number;
        eventType: string;
        severity: string;
        action: string;
        message: string;
        actor?: string | null;
        correlationId?: string | null;
        traceId?: string | null;
        method?: string | null;
        path?: string | null;
        statusCode?: number | null;
        metadata?: unknown;
        previousHash: string;
        createdAt: Date | string;
    }): string;
}
