import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PolicyEvaluation } from "../interfaces/policy-evaluation.interface";
import { PolicyViolation } from "../interfaces/policy-violation.interface";

@Injectable()
export class PolicyViolationRegistryService {
  private readonly violations: PolicyViolation[] = [];

  register(input: {
    method: string;
    path: string;
    evaluation: PolicyEvaluation;
    correlationId?: string;
    traceId?: string;
    actor?: string;
  }): PolicyViolation {
    const violation: PolicyViolation = {
      id: randomUUID(),
      policyIds:
        input.evaluation.matchedPolicyIds,
      method: input.method,
      path: input.path,
      decision:
        input.evaluation.decision,
      riskLevel:
        input.evaluation.riskLevel,
      riskScore:
        input.evaluation.riskScore,
      reasons:
        input.evaluation.reasons,
      correlationId:
        input.correlationId,
      traceId: input.traceId,
      actor: input.actor,
      createdAt:
        new Date().toISOString(),
    };

    this.violations.unshift(violation);

    if (this.violations.length > 5000) {
      this.violations.length = 5000;
    }

    return { ...violation };
  }

  findAll(limit = 100): PolicyViolation[] {
    return this.violations
      .slice(
        0,
        Math.min(
          Math.max(limit, 1),
          1000,
        ),
      )
      .map((item) => ({
        ...item,
        policyIds: [...item.policyIds],
        reasons: [...item.reasons],
      }));
  }

  getSummary() {
    return {
      total: this.violations.length,
      denied: this.violations.filter(
        (item) =>
          item.decision === "deny",
      ).length,
      highRisk: this.violations.filter(
        (item) =>
          item.riskLevel === "high",
      ).length,
      criticalRisk: this.violations.filter(
        (item) =>
          item.riskLevel === "critical",
      ).length,
    };
  }
}
