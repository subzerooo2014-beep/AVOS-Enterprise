import { Injectable } from "@nestjs/common";
import { AiDecisionService } from "../ai-decision/ai-decision.service";
import { AiActionLogService } from "../ai-action-log/ai-action-log.service";
import { PublishJobsService } from "../publish-jobs/publish-jobs.service";

@Injectable()
export class AiActionService {
  constructor(
    private readonly decision: AiDecisionService,
    private readonly log: AiActionLogService,
    private readonly publishJobs: PublishJobsService,
  ) {}

  async execute(vehicleId: string) {
    const d = await this.decision.evaluateVehicle(vehicleId);
    const executed: string[] = [];

    for (const action of d.actions) {
      switch (action) {
        case "ALLOW_LISTING":
          await this.publishJobs.create(vehicleId);
          executed.push("Vehicle published");
          break;

        case "TRUST_BADGE":
          executed.push("Trust badge assigned");
          break;

        case "PROMOTE_TO_MATCHED_BUYERS":
          executed.push("Buyer matching triggered");
          break;

        case "START_MARKETING":
          executed.push("Marketing campaign started");
          break;

        case "ENABLE_EXPORT":
          executed.push("Export workflow prepared");
          break;
      }

      await this.log.write(vehicleId, action, "completed");
    }

    return {
      decision: d.overallDecision,
      actionsExecuted: executed,
      totalActions: executed.length,
      success: true,
    };
  }
}
