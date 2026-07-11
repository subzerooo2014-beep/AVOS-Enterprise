import { PublisherProductionReportService } from "./publisher-production-report.service";
import { PublisherJobExecutorService } from "./publisher-job-executor.service";
export declare class PublisherProductionService {
    private readonly report;
    private readonly executor;
    constructor(report: PublisherProductionReportService, executor: PublisherJobExecutorService);
    execute(limit?: number): Promise<{
        success: boolean;
        execution: import("..").PublisherDispatchBatchResult;
        report: {
            success: boolean;
            finalizer: {
                success: boolean;
                summary: {
                    ready: {
                        success: boolean;
                        engine: string;
                        state: string;
                        timestamp: Date;
                    };
                    metrics: {
                        dispatch: {
                            dispatched: number;
                            failed: number;
                            generatedAt: Date;
                        };
                        channels: {
                            success: boolean;
                            channels: Record<string, any>;
                            generatedAt: Date;
                        };
                        workers: {
                            success: boolean;
                            workers: Record<string, any>;
                            generatedAt: Date;
                        };
                        generatedAt: Date;
                    };
                    generatedAt: Date;
                };
                profiler: {
                    engine: {
                        engine: string;
                        version: string;
                        stage: string;
                        build: string;
                        timestamp: Date;
                    };
                    memory: NodeJS.MemoryUsage;
                    uptime: number;
                    pid: number;
                    generatedAt: Date;
                };
                completedAt: Date;
            };
            runtime: {
                pid: number;
                uptime: number;
                memory: NodeJS.MemoryUsage;
                cpu: NodeJS.CpuUsage;
                generatedAt: Date;
            };
            generatedAt: Date;
        };
        finishedAt: Date;
    }>;
}
