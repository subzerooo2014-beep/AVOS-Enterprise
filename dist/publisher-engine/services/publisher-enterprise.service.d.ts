import { PublisherProductionService } from "./publisher-production.service";
import { PublisherSystemRuntimeService } from "./publisher-system-runtime.service";
export declare class PublisherEnterpriseService {
    private readonly production;
    private readonly runtime;
    constructor(production: PublisherProductionService, runtime: PublisherSystemRuntimeService);
    execute(limit?: number): Promise<{
        success: boolean;
        production: {
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
        };
        runtime: {
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
        version: string;
        generatedAt: Date;
    }>;
}
