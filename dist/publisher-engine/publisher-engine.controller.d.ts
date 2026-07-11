import { PublisherDispatcherService } from "./publisher-dispatcher.service";
import { PublisherRegistryService } from "./publisher-registry.service";
import { PublisherMetricsService } from "./services/publisher-metrics.service";
import { PublisherStatsService } from "./services/publisher-stats.service";
import { PublisherJobAdminService } from "./services/publisher-job-admin.service";
import { PublisherDashboardService } from "./services/publisher-dashboard.service";
import { PublisherPreviewService } from "./services/publisher-preview.service";
import { PublisherSimulationService } from "./services/publisher-simulation.service";
import { PublisherUnlockService } from "./services/publisher-unlock.service";
import { CreatePublishJobDto, CreatePublishJobsBatchDto } from "./dto/create-publish-job.dto";
import { PublisherQueryDto } from "./dto/publisher-query.dto";
export declare class PublisherEngineController {
    private readonly dispatcher;
    private readonly registry;
    private readonly metrics;
    private readonly stats;
    private readonly admin;
    private readonly dashboardService;
    private readonly previewService;
    private readonly simulationService;
    private readonly unlockService;
    constructor(dispatcher: PublisherDispatcherService, registry: PublisherRegistryService, metrics: PublisherMetricsService, stats: PublisherStatsService, admin: PublisherJobAdminService, dashboardService: PublisherDashboardService, previewService: PublisherPreviewService, simulationService: PublisherSimulationService, unlockService: PublisherUnlockService);
    channels(): {
        success: boolean;
        version: string;
        channels: string[];
    };
    health(): Promise<import("./publisher-dispatcher.service").PublisherDispatcherHealth>;
    metricsSummary(): Promise<{
        success: boolean;
        engine: string;
        statuses: any;
        generatedAt: Date;
    }>;
    channelStats(): Promise<{
        success: boolean;
        channels: Record<string, any>;
    }>;
    dashboard(): Promise<{
        success: boolean;
        engine: string;
        counters: any;
        latest: any;
        failed: any;
        generatedAt: Date;
    }>;
    jobs(query: PublisherQueryDto): Promise<{
        success: boolean;
        count: any;
        jobs: any;
    }>;
    job(id: string): Promise<{
        success: boolean;
        message: string;
        job?: undefined;
    } | {
        success: boolean;
        job: any;
        message?: undefined;
    }>;
    publish(body: CreatePublishJobDto): Promise<{
        success: boolean;
        message: string;
        job?: undefined;
    } | {
        success: boolean;
        job: any;
        message?: undefined;
    }>;
    publishMany(body: CreatePublishJobsBatchDto): Promise<{
        success: boolean;
        requested: number;
        created: number;
        jobs: any[];
    }>;
    dispatchQueued(limit?: string): Promise<import("./publisher-dispatcher.service").PublisherDispatchBatchResult>;
    dispatchOne(id: string): Promise<unknown>;
    retry(id: string): Promise<{
        success: boolean;
        message: string;
        job?: undefined;
    } | {
        success: boolean;
        job: any;
        message?: undefined;
    }>;
    retryFailed(limit?: string): Promise<{
        success: boolean;
        retried: number;
        jobs: any[];
    }>;
    cancel(id: string): Promise<{
        success: boolean;
        message: string;
        job?: undefined;
    } | {
        success: boolean;
        job: any;
        message?: undefined;
    }>;
    preview(body: any): {
        success: boolean;
        preview: {
            context: import("./publisher-registry.service").PublisherContext;
            title: any;
            content: any;
            channel: any;
            generatedAt: Date;
        };
    };
    simulate(body: any): Promise<{
        success: boolean;
        simulation: boolean;
        channelExists: boolean;
        health: import("./publisher-registry.service").PublisherStatus;
        context: import("./publisher-registry.service").PublisherContext;
        estimatedResult: {
            status: string;
            channel: string;
            externalId: string;
            message: string;
        };
    }>;
    unlockExpired(minutes?: string): Promise<{
        success: boolean;
        unlocked: number;
        jobs: any[];
    }>;
}
