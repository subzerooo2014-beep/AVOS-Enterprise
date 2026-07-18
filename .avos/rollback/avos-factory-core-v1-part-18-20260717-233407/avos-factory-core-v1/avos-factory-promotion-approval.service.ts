import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryPromotionDecision
} from "./avos-factory-deployment-governance.contracts";
import {
  AvosFactoryDeploymentPlanService
} from "./avos-factory-deployment-plan.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryPromotionApprovalService {
  private readonly decisions: AvosFactoryPromotionDecision[] = [];

  constructor(
    private readonly plans: AvosFactoryDeploymentPlanService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  decide(input: {
    planId: string;
    decision: "approved" | "rejected";
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
    reason: string;
  }): AvosFactoryPromotionDecision {
    if (!input.humanApproved || !input.approvedBy?.trim()) {
      throw new BadRequestException(
        "Promotion decision requires Human Final Authority approval."
      );
    }

    const plan = this.plans.get(input.planId);

    if (!plan) {
      throw new BadRequestException(
        `Deployment plan not found: ${input.planId}`
      );
    }

    if (plan.status !== "validated") {
      throw new BadRequestException(
        `Deployment plan must be validated before promotion decision. Current status: ${plan.status}`
      );
    }

    const decision: AvosFactoryPromotionDecision = {
      id: randomUUID(),
      planId: input.planId,
      decision: input.decision,
      actor: input.actor,
      approvedBy: input.approvedBy,
      humanApproved: true,
      reason: input.reason,
      decidedAt: new Date().toISOString()
    };

    this.decisions.unshift(decision);

    this.plans.update(input.planId, {
      status: input.decision === "approved" ? "approved" : "rejected",
      approvedBy: input.approvedBy,
      humanApproved: true
    });

    this.audit.append({
      category: "governance",
      action: "factory-promotion-decided",
      actor: input.actor,
      approvedBy: input.approvedBy,
      success: input.decision === "approved",
      resourceId: decision.id,
      details: {
        planId: input.planId,
        decision: input.decision,
        reason: input.reason
      }
    });

    return structuredClone(decision);
  }

  list(limit = 100): AvosFactoryPromotionDecision[] {
    return this.decisions
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((decision) => structuredClone(decision));
  }
}
