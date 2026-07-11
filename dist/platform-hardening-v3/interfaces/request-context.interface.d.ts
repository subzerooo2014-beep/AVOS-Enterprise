export interface RequestContext {
    correlationId: string;
    traceId: string;
    requestId: string;
    method: string;
    path: string;
    ip?: string;
    userAgent?: string;
    startedAt: number;
}
