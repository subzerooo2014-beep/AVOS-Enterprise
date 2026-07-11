import { PublisherWorkerHealthService } from "./publisher-worker-health.service";
import { PublisherExecutionLogService } from "./publisher-execution-log.service";
export declare class PublisherRuntimeDashboardService {
    private readonly workers;
    private readonly logs;
    constructor(workers: PublisherWorkerHealthService, logs: PublisherExecutionLogService);
    dashboard(): {
        workers: {
            success: boolean;
            workers: {
                id: string;
                lastSeen: Date;
            }[];
            generatedAt: Date;
        };
        executions: any[];
        generatedAt: Date;
    };
}
