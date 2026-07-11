import { PublisherRegistryService } from "../publisher-registry.service";
import { PublisherMetricsService } from "./publisher-metrics.service";
export declare class PublisherHealthService {
    private readonly registry;
    private readonly metrics;
    constructor(registry: PublisherRegistryService, metrics: PublisherMetricsService);
    health(): Promise<{
        success: boolean;
        version: string;
        channels: {
            channel: string;
            status: import("../publisher-registry.service").PublisherStatus;
        }[];
        metrics: {
            success: boolean;
            engine: string;
            statuses: any;
            generatedAt: Date;
        };
    }>;
}
