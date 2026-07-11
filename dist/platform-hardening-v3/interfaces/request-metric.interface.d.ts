export interface RequestMetric {
    correlationId: string;
    traceId: string;
    method: string;
    path: string;
    statusCode: number;
    durationMs: number;
    success: boolean;
    slow: boolean;
    timestamp: string;
}
