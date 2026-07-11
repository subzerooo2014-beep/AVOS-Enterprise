import { PrismaService } from "../prisma/prisma.service";
import { PublisherDispatcherService } from "../publisher-engine/publisher-dispatcher.service";
import { PublisherRegistryService } from "../publisher-engine/publisher-registry.service";
export interface CampaignLaunchOptions {
    launchedBy?: string;
    dispatchImmediately?: boolean;
    channels?: string[];
}
export interface CampaignChannelPlan {
    channel: string;
    mode?: string;
    budget?: number;
    dailyBudget?: number;
    priority?: string;
    objective?: string;
    expectedAction?: string;
}
export declare class AiCampaignLaunchService {
    private readonly prisma;
    private readonly dispatcher;
    private readonly registry;
    constructor(prisma: PrismaService, dispatcher: PublisherDispatcherService, registry: PublisherRegistryService);
    validate(eventId: string, requestedChannels?: string[]): Promise<{
        success: boolean;
        valid: boolean;
        eventId: any;
        campaignStatus: any;
        vehicleId: string;
        selectedChannels: string[];
        channelPlans: CampaignChannelPlan[];
        unsupportedChannels: string[];
        errors: string[];
        warnings: string[];
        checkedAt: Date;
    }>;
    launch(eventId: string, options?: CampaignLaunchOptions): Promise<{
        success: boolean;
        partialSuccess: boolean;
        eventId: any;
        launch: {
            launchId: `${string}-${string}-${string}-${string}-${string}`;
            correlationId: `${string}-${string}-${string}-${string}-${string}`;
            launchedBy: string;
            dispatchImmediately: boolean;
            channels: string[];
            totalJobs: number;
            successful: number;
            failed: number;
            status: string;
            jobs: any[];
            dispatches: {
                channel: any;
                jobId: any;
                success: any;
                status: any;
                error: any;
            }[];
            startedAt: string;
            completedAt: string;
            durationMs: number;
        };
        campaignStatus: any;
    }>;
    retryFailed(eventId: string, launchedBy?: string): Promise<{
        success: boolean;
        eventId: string;
        retried: number;
        message: string;
        partialSuccess?: undefined;
        status?: undefined;
        attempted?: undefined;
        succeeded?: undefined;
        failed?: undefined;
        retries?: undefined;
    } | {
        success: boolean;
        partialSuccess: boolean;
        eventId: string;
        status: string;
        attempted: number;
        succeeded: number;
        failed: number;
        retries: any[];
        retried?: undefined;
        message?: undefined;
    }>;
    launchSummary(eventId: string): Promise<{
        success: boolean;
        eventId: any;
        campaignStatus: any;
        launchCount: number;
        latestLaunch: any;
        launches: any[];
    }>;
    progress(eventId: string): Promise<{
        success: boolean;
        eventId: string;
        campaignStatus: any;
        launchId: any;
        totals: {
            jobs: number;
            completed: number;
            failed: number;
            pending: number;
        };
        progressPercent: number;
        jobs: any[];
        checkedAt: Date;
    }>;
    private createPublishJob;
    private campaignEvent;
    private selectedChannels;
    private channelPlans;
    private creativeContent;
    private scheduleForChannel;
    private recordLifecycle;
    private dispatchSuccess;
    private dispatchStatus;
    private requiredText;
    private objectOf;
    private errorMessage;
    private audit;
}
