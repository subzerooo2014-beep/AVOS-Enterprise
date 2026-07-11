import { PrismaService } from "../prisma/prisma.service";
import { AiDecisionService } from "../ai-decision/ai-decision.service";
import { PublishJobsService } from "../publish-jobs/publish-jobs.service";
import { AiActionLogService } from "../ai-action-log/ai-action-log.service";
export declare class AiCampaignEngineService {
    private readonly prisma;
    private readonly decision;
    private readonly publishJobs;
    private readonly logs;
    constructor(prisma: PrismaService, decision: AiDecisionService, publishJobs: PublishJobsService, logs: AiActionLogService);
    launchVehicleCampaign(vehicleId: string): Promise<{
        success: boolean;
        vehicleId: string;
        campaign: any;
        creativesCreated: number;
        jobsCreated: number;
        creatives: any[];
        jobs: any[];
    }>;
    private campaignTitle;
    private channels;
    private audience;
    private expectedReach;
    private expectedLeads;
    private performanceScore;
    private createCreatives;
    private caption;
    private hashtags;
    private cta;
    private createPublishJobs;
}
