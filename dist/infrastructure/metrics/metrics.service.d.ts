export declare class MetricsService {
    snapshot(): {
        uptime: number;
        memory: NodeJS.MemoryUsage;
        timestamp: string;
    };
}
