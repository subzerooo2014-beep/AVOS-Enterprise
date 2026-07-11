export declare class PublisherRuntimeMonitorService {
    status(): {
        pid: number;
        uptime: number;
        memory: NodeJS.MemoryUsage;
        cpu: NodeJS.CpuUsage;
        generatedAt: Date;
    };
}
