import { Injectable } from "@nestjs/common";
import type {
  FlowRiskAssessment,
  FlowRiskLevel,
} from "./core-flow-governance.types";

@Injectable()
export class CoreFlowRiskService {
  private readonly assessments: FlowRiskAssessment[] = [];

  assess(executionId: string, context: Record<string, unknown> = {}) {
    const findings: string[] = [];
    let score = 0;

    const amount = Number(context.amount ?? context.total ?? 0);
    const retries = Number(context.attempts ?? 0);
    const crossBorder = Boolean(context.crossBorder);
    const privileged = Boolean(context.privileged);
    const manualOverride = Boolean(context.manualOverride);

    if (amount >= 1_000_000) {
      score += 35;
      findings.push("high-value-transaction");
    } else if (amount >= 100_000) {
      score += 20;
      findings.push("elevated-value-transaction");
    }

    if (retries >= 3) {
      score += 20;
      findings.push("multiple-retries");
    }

    if (crossBorder) {
      score += 15;
      findings.push("cross-border-operation");
    }

    if (privileged) {
      score += 15;
      findings.push("privileged-operation");
    }

    if (manualOverride) {
      score += 25;
      findings.push("manual-policy-override");
    }

    score = Math.min(score, 100);
    const level: FlowRiskLevel =
      score >= 75 ? "critical" :
      score >= 50 ? "high" :
      score >= 25 ? "medium" :
      "low";

    const assessment: FlowRiskAssessment = {
      id: `risk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      score,
      level,
      findings,
      assessedAt: new Date().toISOString(),
    };

    this.assessments.push(assessment);
    return assessment;
  }

  findAll(executionId?: string) {
    return this.assessments
      .filter((item) => !executionId || item.executionId === executionId)
      .slice()
      .reverse();
  }

  dashboard() {
    const count = (level: FlowRiskLevel) =>
      this.assessments.filter((item) => item.level === level).length;

    return {
      total: this.assessments.length,
      low: count("low"),
      medium: count("medium"),
      high: count("high"),
      critical: count("critical"),
      generatedAt: new Date().toISOString(),
    };
  }
}
