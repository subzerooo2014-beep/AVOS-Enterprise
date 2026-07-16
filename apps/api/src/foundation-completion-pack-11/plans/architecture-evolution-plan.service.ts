import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  ArchitectureEvolutionPlan,
  EvolutionPlanStep,
  EvolutionPlanStatus
} from "../foundation-pack-11.types";
import { ArchitectureEvolutionRequestService } from "../requests/architecture-evolution-request.service";
import { ArchitectureEvolutionAnalysisService } from "../analysis/architecture-evolution-analysis.service";
import { EvolutionAuditService } from "../observability/evolution-audit.service";
import { EvolutionHistoryService } from "../history/evolution-history.service";

@Injectable()
export class ArchitectureEvolutionPlanService {
  private readonly plans =
    new Map<string, ArchitectureEvolutionPlan>();

  constructor(
    private readonly requests: ArchitectureEvolutionRequestService,
    private readonly analyses: ArchitectureEvolutionAnalysisService,
    private readonly audit: EvolutionAuditService,
    private readonly history: EvolutionHistoryService
  ) {}

  list() {
    return Array.from(this.plans.values());
  }

  get(id: string) {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new NotFoundException(
        `Evolution plan not found: ${id}`
      );
    }

    return plan;
  }

  create(input: {
    requestId: string;
    analysisId: string;
    name: string;
    description: string;
    steps: Omit<EvolutionPlanStep, "status">[];
    createdByIdentityId: string;
  }) {
    const request = this.requests.get(input.requestId);
    const analysis = this.analyses.get(input.analysisId);

    if (analysis.requestId !== request.id) {
      throw new BadRequestException(
        "Analysis does not belong to the evolution request."
      );
    }

    this.validateSteps(input.steps);

    const now = new Date().toISOString();

    const plan: ArchitectureEvolutionPlan = {
      id: `evolution-plan:${Date.now()}:${
        this.plans.size + 1
      }`,
      requestId: request.id,
      blueprintId: request.blueprintId,
      name: input.name,
      description: input.description,
      status: "ready",
      steps: input.steps.map((step) => ({
        ...step,
        dependsOnStepIds: Array.from(
          new Set(step.dependsOnStepIds)
        ),
        timeoutMs: Math.max(1000, Math.round(step.timeoutMs)),
        maxAttempts: Math.max(1, Math.round(step.maxAttempts)),
        status: "pending"
      })),
      createdByIdentityId: input.createdByIdentityId,
      createdAt: now,
      updatedAt: now
    };

    this.plans.set(plan.id, plan);
    this.requests.updateStatus(
      request.id,
      "planned",
      input.createdByIdentityId
    );

    this.audit.record({
      correlationId: request.correlationId,
      category: "plan",
      action: "evolution-plan-created",
      subjectId: plan.id,
      actorIdentityId: input.createdByIdentityId,
      outcome: "success",
      metadata: {
        requestId: request.id,
        steps: plan.steps.length
      }
    });

    this.history.record({
      requestId: request.id,
      planId: plan.id,
      blueprintId: request.blueprintId,
      action: "plan-created",
      actorIdentityId: input.createdByIdentityId,
      nextStatus: plan.status,
      metadata: {
        analysisId: analysis.id
      }
    });

    return plan;
  }

  updateStatus(
    id: string,
    status: EvolutionPlanStatus,
    actorIdentityId: string
  ) {
    const current = this.get(id);
    const request = this.requests.get(current.requestId);
    const now = new Date().toISOString();

    const updated: ArchitectureEvolutionPlan = {
      ...current,
      status,
      updatedAt: now,
      startedAt:
        status === "executing"
          ? current.startedAt ?? now
          : current.startedAt,
      completedAt:
        status === "completed" ||
        status === "failed" ||
        status === "rolled-back"
          ? now
          : current.completedAt
    };

    this.plans.set(id, updated);

    this.audit.record({
      correlationId: request.correlationId,
      category: "plan",
      action: `plan-status:${status}`,
      subjectId: id,
      actorIdentityId,
      outcome:
        status === "failed"
          ? "failure"
          : status === "waiting-approval"
            ? "pending"
            : "success",
      metadata: {
        previousStatus: current.status
      }
    });

    this.history.record({
      requestId: request.id,
      planId: id,
      blueprintId: request.blueprintId,
      action: "plan-status-changed",
      actorIdentityId,
      previousStatus: current.status,
      nextStatus: status,
      metadata: {}
    });

    return updated;
  }

  updateStep(
    planId: string,
    stepId: string,
    patch: Partial<EvolutionPlanStep>
  ) {
    const current = this.get(planId);

    const steps = current.steps.map((step) =>
      step.id === stepId
        ? {
            ...step,
            ...patch
          }
        : step
    );

    const updated: ArchitectureEvolutionPlan = {
      ...current,
      steps,
      currentStepId:
        patch.status === "running"
          ? stepId
          : current.currentStepId,
      updatedAt: new Date().toISOString()
    };

    this.plans.set(planId, updated);
    return updated;
  }

  summary() {
    const plans = this.list();

    return {
      total: plans.length,
      ready: plans.filter(
        (plan) => plan.status === "ready"
      ).length,
      waitingApproval: plans.filter(
        (plan) => plan.status === "waiting-approval"
      ).length,
      executing: plans.filter(
        (plan) => plan.status === "executing"
      ).length,
      completed: plans.filter(
        (plan) => plan.status === "completed"
      ).length,
      rolledBack: plans.filter(
        (plan) => plan.status === "rolled-back"
      ).length
    };
  }

  private validateSteps(
    steps: Omit<EvolutionPlanStep, "status">[]
  ) {
    if (steps.length === 0) {
      throw new BadRequestException(
        "Evolution plan must contain at least one step."
      );
    }

    const ids = steps.map((step) => step.id);

    if (new Set(ids).size !== ids.length) {
      throw new BadRequestException(
        "Evolution step identifiers must be unique."
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
    }
  }
}
