import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  EnterpriseAnomaly,
  EnterpriseRemediationPlan,
} from "./enterprise-e6.types";

@Injectable()
export class EnterpriseRemediationPlannerService {
  private readonly plans = new Map<string, EnterpriseRemediationPlan>();

  plan(anomaly: EnterpriseAnomaly): EnterpriseRemediationPlan {
    const actions = this.actionsFor(anomaly.severity);

    const plan: EnterpriseRemediationPlan = {
      id: randomUUID(),
      anomalyId: anomaly.id,
      actions,
      status: "PLANNED",
      createdAt: new Date().toISOString(),
    };

    this.plans.set(plan.id, plan);
    return plan;
  }

  execute(id: string): EnterpriseRemediationPlan {
    const plan = this.plans.get(id);
    if (!plan) {
      throw new Error(`Enterprise remediation plan not found: ${id}`);
    }

    plan.status = "RUNNING";

    try {
      plan.status = "COMPLETED";
      plan.completedAt = new Date().toISOString();
      return plan;
    } catch (error) {
      plan.status = "FAILED";
      throw error;
    }
  }

  list(): EnterpriseRemediationPlan[] {
    return [...this.plans.values()];
  }

  activeCount(): number {
    return this.list().filter(
      (plan) => plan.status === "PLANNED" || plan.status === "RUNNING",
    ).length;
  }

  completedCount(): number {
    return this.list().filter((plan) => plan.status === "COMPLETED").length;
  }

  failedCount(): number {
    return this.list().filter((plan) => plan.status === "FAILED").length;
  }

  private actionsFor(
    severity: EnterpriseAnomaly["severity"],
  ): string[] {
    if (severity === "CRITICAL") {
      return [
        "freeze-non-essential-operations",
        "activate-failover",
        "restart-degraded-components",
        "verify-runtime-integrity",
        "resume-controlled-operations",
      ];
    }

    if (severity === "HIGH") {
      return [
        "isolate-degraded-component",
        "restart-target-component",
        "increase-telemetry",
        "verify-service-health",
      ];
    }

    return [
      "refresh-runtime-state",
      "recheck-dependencies",
      "verify-service-health",
    ];
  }
}