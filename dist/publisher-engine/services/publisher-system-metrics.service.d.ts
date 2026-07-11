export declare class PublisherSystemMetricsService {
    metrics(): {
        pid: number;
        uptime: number;
        rss: number;
        heapUsed: number;
        heapTotal: number;
        external: number;
        node: string;
        platform: NodeJS.Platform;
        generatedAt: Date;
    };
}
