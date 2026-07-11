export declare class PublisherRuntimeStatService {
    stats(): {
        pid: number;
        uptime: number;
        cpu: NodeJS.CpuUsage;
        platform: NodeJS.Platform;
        node: string;
        generatedAt: Date;
    };
}
