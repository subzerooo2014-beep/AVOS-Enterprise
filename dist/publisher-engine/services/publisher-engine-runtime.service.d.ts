import { PublisherRuntimeService } from "./publisher-runtime.service";
import { PublisherDispatchMetricsService } from "./publisher-dispatch-metrics.service";
export declare class PublisherEngineRuntimeService {
    private readonly runtime;
    private readonly metrics;
    constructor(runtime: PublisherRuntimeService, metrics: PublisherDispatchMetricsService);
    status(): Promise<{
        runtime: {
            status: {
                engine: string;
                version: string;
                status: string;
                timestamp: Date;
            };
            queue: {
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
            generatedAt: Date;
        };
        metrics: {
            dispatched: number;
            failed: number;
            generatedAt: Date;
        };
        timestamp: Date;
    }>;
}
