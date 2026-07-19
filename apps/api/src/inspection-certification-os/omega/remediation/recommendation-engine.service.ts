import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  RemediationIssue,
  RemediationRecommendation,
} from "./omega-remediation.types";

@Injectable()
export class RecommendationEngineService {
  generate(
    issue: RemediationIssue,
  ): RemediationRecommendation {
    const actions = this.actionsFor(issue);

    return {
      recommendationId: `OMEGA-RECOMMENDATION-${randomUUID()}`,
      issueId: issue.issueId,
      priority: this.priority(issue.riskScore),
      title: `Remediate: ${issue.title}`,
      rationale: [
        `Severity is ${issue.severity}.`,
        `Calculated risk score is ${issue.riskScore}.`,
        "Recommendation is evidence-driven and requires human approval.",
      ],
      actions,
      automationCandidate:
        issue.severity !== "critical" &&
        issue.riskScore < 85,
      requiresHumanApproval: true,
    };
  }

  private priority(riskScore: number): number {
    if (riskScore >= 85) return 1;
    if (riskScore >= 65) return 2;
    if (riskScore >= 40) return 3;
    return 4;
  }

  private actionsFor(issue: RemediationIssue): readonly string[] {
    const base = [
      "Review the finding and linked evidence.",
      "Identify the safest non-destructive remediation.",
      "Submit the proposed change for human approval.",
      "Apply the approved remediation.",
      "Run targeted verification and re-inspection.",
    ];

    if (issue.severity === "critical") {
      return [
        "Isolate the affected execution path.",
        ...base,
        "Require explicit production release approval.",
      ];
    }

    return base;
  }
}
