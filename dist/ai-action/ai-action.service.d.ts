import { AiDecisionService } from "../ai-decision/ai-decision.service";
import { AiActionLogService } from "../ai-action-log/ai-action-log.service";
import { PublishJobsService } from "../publish-jobs/publish-jobs.service";
export declare class AiActionService {
    private readonly decision;
    private readonly log;
    private readonly publishJobs;
    constructor(decision: AiDecisionService, log: AiActionLogService, publishJobs: PublishJobsService);
    execute(vehicleId: string): Promise<{
        decision: string;
        actionsExecuted: string[];
        totalActions: number;
        success: boolean;
    }>;
}
