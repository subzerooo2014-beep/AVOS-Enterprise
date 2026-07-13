import { Injectable } from "@nestjs/common";

@Injectable()
export class CoreFlowAutonomyPolicyService {
  evaluate(dto: any) {
    const confidence = Math.min(Math.max(Number(dto?.confidence ?? 0), 0), 1);
    const riskScore = Math.min(Math.max(Number(dto?.riskScore ?? 0), 0), 100);
    const requiresApproval =
      confidence < 0.85 ||
      riskScore >= 50 ||
      Boolean(dto?.manualApprovalRequired);

    return {
      allowed: !requiresApproval,
      requiresApproval,
      reason: requiresApproval
        ? "Autonomous action requires human approval."
        : "Autonomous action satisfies confidence and risk thresholds.",
      thresholds: {
        minimumConfidence: 0.85,
        maximumAutonomousRiskScore: 49,
      },
      evaluatedAt: new Date().toISOString(),
    };
  }
}
