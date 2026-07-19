import { Injectable } from "@nestjs/common";
import {
  RemediationAction,
  RemediationIssue,
} from "./omega-remediation.types";

@Injectable()
export class AutoFixPlannerService {
  plan(input: {
    readonly issues: readonly RemediationIssue[];
    readonly actions: readonly RemediationAction[];
  }) {
    const eligibleIssueIds = new Set(
      input.issues
        .filter(
          (issue) =>
            issue.severity !== "critical" &&
            issue.riskScore < 85,
        )
        .map((issue) => issue.issueId),
    );

    const candidates = input.actions.filter(
      (action) =>
        action.executable &&
        eligibleIssueIds.has(action.issueId),
    );

    return {
      candidateActions: candidates,
      candidateCount: candidates.length,
      destructiveActions: 0,
      executionAllowed: false,
      requiresHumanApproval: true,
      rationale: [
        "Only non-critical, non-destructive actions are candidates.",
        "Automatic execution remains disabled until human approval.",
      ],
    };
  }
}
