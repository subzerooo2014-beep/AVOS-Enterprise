import { PublisherRuntimeMonitorService } from "./publisher-runtime-monitor.service";
import { PublisherExecutionLogService } from "./publisher-execution-log.service";
export declare class PublisherEngineMonitorService {
    private readonly runtime;
    private readonly log;
    constructor(runtime: PublisherRuntimeMonitorService, log: PublisherExecutionLogService);
    monitor(): {
        runtime: {
            pid: number;
            uptime: number;
            memory: NodeJS.MemoryUsage;
            cpu: NodeJS.CpuUsage;
            generatedAt: Date;
        };
        executions: any[];
        generatedAt: Date;
    };
}
