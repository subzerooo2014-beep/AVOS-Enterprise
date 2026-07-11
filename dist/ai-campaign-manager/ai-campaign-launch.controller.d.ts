import { AiCampaignLaunchService } from "./ai-campaign-launch.service";
export declare class AiCampaignLaunchController {
    private readonly service;
    constructor(service: AiCampaignLaunchService);
    validate(eventId: string, body?: {
        channels?: string[];
    }): Promise<{
        success: boolean;
        valid: boolean;
        eventId: any;
        campaignStatus: any;
        vehicleId: string;
        selectedChannels: string[];
        channelPlans: import("./ai-campaign-launch.service").CampaignChannelPlan[];
        unsupportedChannels: string[];
        errors: string[];
        warnings: string[];
        checkedAt: Date;
    }>;
    launch(eventId: string, body?: {
        launchedBy?: string;
        dispatchImmediately?: boolean;
        channels?: string[];
    }): Promise<{
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
    retryFailed(eventId: string, body?: {
        launchedBy?: string;
    }): Promise<{
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
    summary(eventId: string): Promise<{
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
}
