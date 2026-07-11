import { PublisherEngineFinalizerService } from "./publisher-engine-finalizer.service";
import { PublisherRuntimeMonitorService } from "./publisher-runtime-monitor.service";
export declare class PublisherProductionReportService {
    private readonly finalizer;
    private readonly runtime;
    constructor(finalizer: PublisherEngineFinalizerService, runtime: PublisherRuntimeMonitorService);
    report(): Promise<{
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
    }>;
}
