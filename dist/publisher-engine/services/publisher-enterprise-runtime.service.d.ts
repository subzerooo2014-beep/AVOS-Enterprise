import { PublisherEngineRuntimeV2Service } from "./publisher-engine-runtime-v2.service";
import { PublisherProductionService } from "./publisher-production.service";
export declare class PublisherEnterpriseRuntimeService {
    private readonly runtime;
    private readonly production;
    constructor(runtime: PublisherEngineRuntimeV2Service, production: PublisherProductionService);
    report(limit?: number): Promise<{
        runtime: {
            success: boolean;
            dashboard: {
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
            queue: {
                monitor: {
                    success: boolean;
                    queue: {
                        queued: number;
                        processing: number;
                        published: number;
                        failed: number;
                        dead: number;
                        skipped: number;
                    };
                    total: any;
                    generatedAt: Date;
                };
                queued: any;
                generatedAt: Date;
            };
            generatedAt: Date;
        };
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
        generatedAt: Date;
    }>;
}
