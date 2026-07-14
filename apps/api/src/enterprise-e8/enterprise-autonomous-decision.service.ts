import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  EnterpriseDecision,
  EnterpriseDecisionStatus,
} from "./enterprise-e8.types";
import { EnterpriseResilienceEngineService } from "./enterprise-resilience-engine.service";

@Injectable()
export class EnterpriseAutonomousDecisionService {
  private readonly decisions = new Map<string, EnterpriseDecision>();

  constructor(
    private readonly resilience: EnterpriseResilienceEngineService,
  ) {}

  propose(): EnterpriseDecision {
    const evaluation = this.resilience.evaluate();
    const action =
      evaluation.scenario.riskLevel === "CRITICAL"
        ? "activate-enterprise-containment"
        : evaluation.scenario.riskLevel === "HIGH"
          ? "activate-preventive-mitigation"
          : "optimize-enterprise-runtime";

    const decision: EnterpriseDecision = {
      id: randomUUID(),
      title: "Autonomous enterprise resilience decision",
      domain: evaluation.scenario.domain,
      rationale: `Scenario ${evaluation.scenario.name} produced ${evaluation.scenario.riskLevel} risk.`,
      action,
      confidence: Math.min(99, Math.max(60, evaluation.scenario.probability)),
      status: "APPROVED",
      createdAt: new Date().toISOString(),
    };

    this.decisions.set(decision.id, decision);
    return decision;
  }

  execute(id: string): EnterpriseDecision {
    const decision = this.decisions.get(id);
    if (!decision) {
      throw new Error(`Enterprise decision not found: ${id}`);
    }

    const status: EnterpriseDecisionStatus =
      decision.confidence >= 60 ? "EXECUTED" : "BLOCKED";

    decision.status = status;
    if (status === "EXECUTED") {
      decision.executedAt = new Date().toISOString();
    }

    return decision;
  }

  list(): EnterpriseDecision[] {
    return [...this.decisions.values()];
  }

  count(): number {
    return this.decisions.size;
  }

  executedCount(): number {
    return this.list().filter((item) => item.status === "EXECUTED").length;
  }

  blockedCount(): number {
    return this.list().filter((item) => item.status === "BLOCKED").length;
  }
}