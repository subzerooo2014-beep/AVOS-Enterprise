import { PublisherRuntimeStatService } from "./publisher-runtime-stat.service";
import { PublisherMemoryStatService } from "./publisher-memory-stat.service";
export declare class PublisherHealthReportService {
    private readonly runtime;
    private readonly memory;
    constructor(runtime: PublisherRuntimeStatService, memory: PublisherMemoryStatService);
    report(): {
        success: boolean;
        runtime: {
            pid: number;
            uptime: number;
            cpu: NodeJS.CpuUsage;
            platform: NodeJS.Platform;
            node: string;
            generatedAt: Date;
        };
        memory: {
            rss: number;
            heapUsed: number;
            heapTotal: number;
            external: number;
            arrayBuffers: number;
            generatedAt: Date;
        };
        generatedAt: Date;
    };
}
