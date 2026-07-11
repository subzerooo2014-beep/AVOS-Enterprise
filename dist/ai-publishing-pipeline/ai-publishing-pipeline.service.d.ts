import { AiDecisionService } from "../ai-decision/ai-decision.service";
import { PublishJobsService } from "../publish-jobs/publish-jobs.service";
import { AiActionLogService } from "../ai-action-log/ai-action-log.service";
export declare class AiPublishingPipelineService {
    private readonly decision;
    private readonly publishJobs;
    private readonly actionLog;
    constructor(decision: AiDecisionService, publishJobs: PublishJobsService, actionLog: AiActionLogService);
    run(vehicleId: string): Promise<{
        success: boolean;
        vehicleId: string;
        decision: string;
        selectedChannels: string[];
        jobsCreated: number;
        jobs: any[];
    }>;
    private selectChannels;
    private buildCreative;
}
