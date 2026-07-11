export declare class AuditHashUtil {
    static createHash(input: {
        sequence: number;
        type: string;
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
        previousHash: string;
        createdAt: string;
    }): string;
}
