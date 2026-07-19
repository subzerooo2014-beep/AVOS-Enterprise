import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  RemediationAction,
  RemediationIssue,
  RemediationRecommendation,
} from "./omega-remediation.types";

@Injectable()
export class ActionPlanGeneratorService {
  generate(input: {
    readonly issues: readonly RemediationIssue[];
    readonly recommendations: readonly RemediationRecommendation[];
  }): readonly RemediationAction[] {
    const actions: RemediationAction[] = [];

    for (const recommendation of input.recommendations) {
      recommendation.actions.forEach((title, index) => {
        actions.push({
          actionId: `OMEGA-ACTION-${randomUUID()}`,
          issueId: recommendation.issueId,
          title,
          sequence: index + 1,
          status: "pending",
          executable: recommendation.automationCandidate,
          destructive: false,
          requiresHumanApproval: true,
        });
      });
    }

    return actions;
  }
}
