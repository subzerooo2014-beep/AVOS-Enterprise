import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityApprovalService } from "./capability-approval.service";
import { CapabilityMigrationPlan } from "./capability-enterprise.types";

@Injectable()
export class CapabilityMigrationService {
  private readonly plans = new Map<string, CapabilityMigrationPlan>();

  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly approvals: CapabilityApprovalService,
  ) {}

  create(input: {
    capabilityKey: string;
    toVersion: string;
    strategy: CapabilityMigrationPlan["strategy"];
    steps: string[];
    rollbackSteps: string[];
    approvalRequestId?: string;
  }) {
    const capability = this.registry.get(input.capabilityKey);
    if (!capability) {
      return { success: false, reason: "CAPABILITY_NOT_REGISTERED" };
    }

    const now = new Date().toISOString();
    const plan: CapabilityMigrationPlan = {
      id: randomUUID(),
      capabilityKey: capability.identity.key,
      fromVersion: capability.version,
      toVersion: input.toVersion,
      strategy: input.strategy,
      steps: [...input.steps],
      rollbackSteps: [...input.rollbackSteps],
      approvalRequestId: input.approvalRequestId,
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.plans.set(plan.id, plan);
    return { success: true, plan: structuredClone(plan) };
  }

  approve(planId: string) {
    const plan = this.require(planId);

    if (!this.approvals.isApproved(plan.capabilityKey, "MIGRATE")) {
      return { success: false, reason: "MIGRATION_APPROVAL_REQUIRED" };
    }

    plan.status = "APPROVED";
    plan.updatedAt = new Date().toISOString();
    return { success: true, plan: structuredClone(plan) };
  }

  complete(planId: string) {
    const plan = this.require(planId);
    if (plan.status !== "APPROVED" && plan.status !== "EXECUTING") {
      return { success: false, reason: "MIGRATION_NOT_APPROVED" };
    }

    plan.status = "COMPLETED";
    plan.updatedAt = new Date().toISOString();
    return { success: true, plan: structuredClone(plan) };
  }

  list() {
    return [...this.plans.values()].map((plan) => structuredClone(plan));
  }

  private require(planId: string) {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Migration plan not found: ${planId}`);
    return plan;
  }
}