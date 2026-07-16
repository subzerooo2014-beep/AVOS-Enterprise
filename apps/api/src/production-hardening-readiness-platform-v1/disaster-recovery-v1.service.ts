import { Injectable, NotFoundException } from "@nestjs/common";
import type { DisasterRecoveryPlanV1 } from "./production-hardening-readiness-v1.types";

@Injectable()
export class DisasterRecoveryV1Service {
  private readonly plans = new Map<string, DisasterRecoveryPlanV1>();

  create(
    name: string,
    rtoMinutes: number,
    rpoMinutes: number,
    regions: string[],
  ): DisasterRecoveryPlanV1 {
    const plan: DisasterRecoveryPlanV1 = {
      id: `dr-plan-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      name,
      rtoMinutes,
      rpoMinutes,
      regions: [...regions],
      status: "DRAFT",
      findings: [],
    };

    this.plans.set(plan.id, plan);
    return this.clone(plan);
  }

  validate(
    id: string,
    achievedRtoMinutes: number,
    achievedRpoMinutes: number,
  ): DisasterRecoveryPlanV1 {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new NotFoundException(`Disaster recovery plan '${id}' was not found.`);
    }

    const findings: string[] = [];

    if (achievedRtoMinutes > plan.rtoMinutes) {
      findings.push("RTO target was not met.");
    }

    if (achievedRpoMinutes > plan.rpoMinutes) {
      findings.push("RPO target was not met.");
    }

    plan.status = findings.length === 0 ? "VALIDATED" : "FAILED";
    plan.findings = findings;
    plan.lastTestedAt = new Date().toISOString();

    return this.clone(plan);
  }

  list(): DisasterRecoveryPlanV1[] {
    return Array.from(this.plans.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.plans.size;
  }

  validatedCount(): number {
    return this.list().filter((item) => item.status === "VALIDATED").length;
  }

  private clone(item: DisasterRecoveryPlanV1): DisasterRecoveryPlanV1 {
    return {
      ...item,
      regions: [...item.regions],
      findings: [...item.findings],
    };
  }
}
