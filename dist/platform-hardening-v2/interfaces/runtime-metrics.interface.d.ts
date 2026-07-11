export interface RuntimeMetrics {
    timestamp: string;
    uptimeSeconds: number;
    processId: number;
    nodeVersion: string;
    platform: string;
    architecture: string;
    memory: {
        rssBytes: number;
        heapTotalBytes: number;
        heapUsedBytes: number;
        externalBytes: number;
        arrayBuffersBytes: number;
        heapUsagePercent: number;
    };
    cpu: {
        userMicroseconds: number;
        systemMicroseconds: number;
    };
    eventLoop: {
        sampledDelayMs: number;
        status: "healthy" | "degraded";
    };
}
