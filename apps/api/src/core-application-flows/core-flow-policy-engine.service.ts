import { Injectable } from "@nestjs/common";
import type { FlowPolicyDecision } from "./core-flow-governance.types";
import { CoreFlowRiskService } from "./core-flow-risk.service";

@Injectable()
export class CoreFlowPolicyEngineService {
  private readonly decisions: FlowPolicyDecision[] = [];

  constructor(private readonly risk: CoreFlowRiskService) {}

  decide(executionId: string, policy: string, context: Record<string, unknown> = {}) {
    const assessment = this.risk.assess(executionId, context);

    let effect: FlowPolicyDecision["effect"] = "allow";
    let reason = "Policy conditions satisfied.";

    if (assessment.level === "critical") {
      effect = "deny";
      reason = "Critical risk assessment blocks execution.";
    } else if (assessment.level === "high") {
      effect = "review";
      reason = "High risk requires human review.";
    } else if (Boolean(context.forceReview)) {
      effect = "review";
      reason = "Execution explicitly requires review.";
    }

    const decision: FlowPolicyDecision = {
      id: `decision_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      policy,
      effect,
      reason,
      decidedAt: new Date().toISOString(),
    };

    this.decisions.push(decision);
    return { decision, assessment };
  }

  findAll(executionId?: string) {
    return this.decisions
      .filter((item) => !executionId || item.executionId === executionId)
      .slice()
      .reverse();
  }

  dashboard() {
    const count = (effect: FlowPolicyDecision["effect"]) =>
      this.decisions.filter((item) => item.effect === effect).length;

    return {
      total: this.decisions.length,
      allowed: count("allow"),
      denied: count("deny"),
      review: count("review"),
      generatedAt: new Date().toISOString(),
    };
  }
}
