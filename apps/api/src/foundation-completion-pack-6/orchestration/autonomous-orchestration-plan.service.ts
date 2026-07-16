import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  OrchestrationPlan,
  OrchestrationStepDefinition
} from "../foundation-pack-6.types";
import { EnterpriseEventBackboneService } from "../events/enterprise-event-backbone.service";
import { NervousSystemTraceService } from "../observability/nervous-system-trace.service";

@Injectable()
export class AutonomousOrchestrationPlanService {
  private readonly plans = new Map<string, OrchestrationPlan>();

  constructor(
    private readonly events: EnterpriseEventBackboneService,
    private readonly trace: NervousSystemTraceService
  ) {}

  list() {
    return Array.from(this.plans.values());
  }

  get(id: string) {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new NotFoundException(`Orchestration plan not found: ${id}`);
    }

    return plan;
  }

  create(input: {
    name: string;
    description: string;
    objective: string;
    correlationId: string;
    requestedByIdentityId: string;
    steps: OrchestrationStepDefinition[];
    context?: Record<string, unknown>;
  }) {
    this.validateSteps(input.steps);

    const now = new Date().toISOString();
    const plan: OrchestrationPlan = {
      id: `orchestration-plan:${Date.now()}:${this.plans.size + 1}`,
      name: input.name,
      description: input.description,
      objective: input.objective,
      correlationId: input.correlationId,
      requestedByIdentityId: input.requestedByIdentityId,
      status: "ready",
      steps: input.steps.map((step) => ({
        ...step,
        dependsOnStepIds: Array.from(new Set(step.dependsOnStepIds)),
        timeoutMs: Math.max(1000, Math.round(step.timeoutMs)),
        maxAttempts: Math.max(1, Math.round(step.maxAttempts))
      })),
      context: input.context ?? {},
      humanFinalAuthority: true,
      createdAt: now,
      updatedAt: now
    };

    this.plans.set(plan.id, plan);

    this.events.publish({
      eventType: "avos.orchestration.requested",
      eventVersion: "1.0.0",
      sourceCapabilityId: "capability:autonomous-orchestration",
      sourceIdentityId: input.requestedByIdentityId,
      subjectId: plan.id,
      correlationId: plan.correlationId,
      priority: "high",
      payload: {
        planId: plan.id,
        objective: plan.objective,
        steps: plan.steps.length
      }
    });

    this.trace.record({
      correlationId: plan.correlationId,
      category: "orchestration",
      action: "plan-created",
      subjectId: plan.id,
      actorIdentityId: input.requestedByIdentityId,
      outcome: "success",
      metadata: {
        objective: plan.objective,
        steps: plan.steps.length,
        humanFinalAuthority: plan.humanFinalAuthority
      }
    });

    return plan;
  }

  updateStatus(
    id: string,
    status: OrchestrationPlan["status"],
    actorIdentityId: string
  ) {
    const current = this.get(id);
    const now = new Date().toISOString();

    const updated: OrchestrationPlan = {
      ...current,
      status,
      updatedAt: now,
      startedAt:
        status === "running"
          ? current.startedAt ?? now
          : current.startedAt,
      completedAt:
        status === "completed" || status === "failed"
          ? now
          : current.completedAt
    };

    this.plans.set(id, updated);

    this.trace.record({
      correlationId: updated.correlationId,
      category: "orchestration",
      action: `plan-status:${status}`,
      subjectId: updated.id,
      actorIdentityId,
      outcome:
        status === "failed"
          ? "failure"
          : status === "waiting-human-approval"
            ? "pending"
            : "success",
      metadata: {
        status
      }
    });

    return updated;
  }

  summary() {
    const plans = this.list();

    return {
      total: plans.length,
      running: plans.filter((plan) => plan.status === "running").length,
      waitingHumanApproval: plans.filter(
        (plan) => plan.status === "waiting-human-approval"
      ).length,
      completed: plans.filter((plan) => plan.status === "completed").length,
      failed: plans.filter((plan) => plan.status === "failed").length
    };
  }

  private validateSteps(steps: OrchestrationStepDefinition[]) {
    if (steps.length === 0) {
      throw new BadRequestException(
        "An orchestration plan must contain at least one step."
      );
    }

    const ids = steps.map((step) => step.id);

    if (new Set(ids).size !== ids.length) {
      throw new BadRequestException(
        "Orchestration step identifiers must be unique."
      );
    }

    for (const step of steps) {
      for (const dependencyId of step.dependsOnStepIds) {
        if (!ids.includes(dependencyId)) {
          throw new BadRequestException(
            `Unknown dependency ${dependencyId} for step ${step.id}.`
          );
        }

        if (dependencyId === step.id) {
          throw new BadRequestException(
            `Step ${step.id} cannot depend on itself.`
          );
        }
      }

      if (
        step.executionMode === "human-required" &&
        !step.requiredApprovalRole
      ) {
        throw new BadRequestException(
          `Step ${step.id} requires an approval role.`
        );
      }
    }
  }
}
