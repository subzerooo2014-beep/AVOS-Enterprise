import { PublisherEnterpriseRuntimeService } from "./publisher-enterprise-runtime.service";
import { PublisherEngineMonitorService } from "./publisher-engine-monitor.service";
export declare class PublisherEnterpriseDashboardService {
    private readonly runtime;
    private readonly monitor;
    constructor(runtime: PublisherEnterpriseRuntimeService, monitor: PublisherEngineMonitorService);
    dashboard(): Promise<{
        success: boolean;
        runtime: {
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
        };
        monitor: {
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
        generatedAt: Date;
    }>;
}
