import { PublisherEngineProfilerService } from "./publisher-engine-profiler.service";
import { PublisherEngineSummaryService } from "./publisher-engine-summary.service";
export declare class PublisherEngineFinalizerService {
    private readonly profiler;
    private readonly summary;
    constructor(profiler: PublisherEngineProfilerService, summary: PublisherEngineSummaryService);
    finalize(): Promise<{
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
    }>;
}
