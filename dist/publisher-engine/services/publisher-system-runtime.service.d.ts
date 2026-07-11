import { PublisherRuntimeMonitorService } from "./publisher-runtime-monitor.service";
import { PublisherEngineStatusService } from "./publisher-engine-status.service";
export declare class PublisherSystemRuntimeService {
    private readonly runtime;
    private readonly status;
    constructor(runtime: PublisherRuntimeMonitorService, status: PublisherEngineStatusService);
    info(): {
        runtime: {
            pid: number;
            uptime: number;
            memory: NodeJS.MemoryUsage;
            cpu: NodeJS.CpuUsage;
            generatedAt: Date;
        };
        status: {
            engine: string;
            version: string;
            status: string;
            timestamp: Date;
        };
        generatedAt: Date;
    };
}
