import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthActionService } from "../execution-core/adaptive-growth-action.service";
import { AdaptiveGrowthApprovalStoreService } from "./adaptive-growth-approval-store.service";
import { AgsDecisionExplanation } from "./adaptive-growth-approval.contracts";

@Injectable()
export class AdaptiveGrowthDecisionExplainabilityService {
  constructor(
    private readonly actions:
      AdaptiveGrowthActionService,
    private readonly store:
      AdaptiveGrowthApprovalStoreService,
  ) {}

  explain(
    approvalId: string,
  ): AgsDecisionExplanation {
    const approval =
      this.store.getApproval(approvalId);

    const action = this.actions.get(
      approval.actionId,
    );

    const evidence =
      this.store.listEvidence(approvalId);

    const confidence =
      evidence.length === 0
        ? 0.5
        : evidence.reduce(
            (sum, item) =>
              sum + item.confidence,
            0,
          ) / evidence.length;

    return {
      approvalId,
      actionId: action.id,
      whyThisAction: action.objective,
      expectedImpact:
        `Execute ${action.title} through ${action.definitionKey}.`,
      risks: [
        `Risk level: ${action.riskLevel}`,
        action.supportsRollback
          ? "Rollback is supported."
          : "Rollback is not supported.",
      ],
      alternatives: [
        "Reject the action.",
        "Return the action for changes.",
        "Request more evidence.",
        "Delay execution.",
      ],
      confidence:
        Number(confidence.toFixed(4)),
      requiredApproval:
        approval.requiredAuthority,
      humanFinalAuthority: true,
    };
  }
}