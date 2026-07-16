import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainRecoveryPlan } from "../enterprise-brain-mega-pack-3.types";
import { BrainPlanningEngineService } from "../planning/brain-planning-engine.service";
import { BrainReasoningAuditService } from "../observability/brain-reasoning-audit.service";

@Injectable()
export class BrainRecoveryPlannerService {
  private readonly plans = new Map<string, BrainRecoveryPlan>();

  constructor(
    private readonly executionPlans: BrainPlanningEngineService,
    private readonly audit: BrainReasoningAuditService
  ) {}

  list() {
    return Array.from(this.plans.values());
  }

  get(id: string) {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new NotFoundException(`Brain recovery plan not found: ${id}`);
    }

    return plan;
  }

  create(input: {
    executionPlanId: string;
    triggers: string[];
    actions: BrainRecoveryPlan["actions"];
    actorIdentityId: string;
    correlationId: string;
  }) {
    const executionPlan = this.executionPlans.get(input.executionPlanId);

    const now = new Date().toISOString();

    const plan: BrainRecoveryPlan = {
      id: `brain-recovery-plan:${Date.now()}:${this.plans.size + 1}`,
      executionPlanId: executionPlan.id,
      triggers: Array.from(new Set(input.triggers)),
      actions: input.actions
        .map((action) => ({ ...action }))
        .sort((left, right) => left.order - right.order),
      status: "ready",
      createdAt: now,
      updatedAt: now
    };

    this.plans.set(plan.id, plan);

    this.audit.record({
      correlationId: input.correlationId,
      category: "recovery",
      action: "brain-recovery-plan-created",
      subjectId: plan.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        executionPlanId: executionPlan.id,
        actions: plan.actions.length
      }
    });

    return plan;
  }

  execute(input: {
    recoveryPlanId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.recoveryPlanId);

    const updated: BrainRecoveryPlan = {
      ...current,
      status: "executed",
      updatedAt: new Date().toISOString()
    };

    this.plans.set(updated.id, updated);
    return updated;
  }

  summary() {
    const plans = this.list();

    return {
      total: plans.length,
      ready: plans.filter((x) => x.status === "ready").length,
      executed: plans.filter((x) => x.status === "executed").length,
      failed: plans.filter((x) => x.status === "failed").length
    };
  }
}
