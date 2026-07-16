import { Injectable } from "@nestjs/common";
import {
  EvolutionExecutionRecord
} from "../foundation-pack-11.types";
import { ArchitectureEvolutionRequestService } from "../requests/architecture-evolution-request.service";
import { ArchitectureEvolutionPlanService } from "../plans/architecture-evolution-plan.service";
import { EvolutionApprovalService } from "../approvals/evolution-approval.service";
import { EvolutionAuditService } from "../observability/evolution-audit.service";
import { EvolutionHistoryService } from "../history/evolution-history.service";

@Injectable()
export class ArchitectureEvolutionExecutionService {
  private readonly executions =
    new Map<string, EvolutionExecutionRecord>();

  constructor(
    private readonly requests: ArchitectureEvolutionRequestService,
    private readonly plans: ArchitectureEvolutionPlanService,
    private readonly approvals: EvolutionApprovalService,
    private readonly audit: EvolutionAuditService,
    private readonly history: EvolutionHistoryService
  ) {}

  list() {
    return Array.from(this.executions.values());
  }

  byPlan(planId: string) {
    return this.list().filter(
      (execution) => execution.planId === planId
    );
  }

  start(planId: string, actorIdentityId: string) {
    const plan = this.plans.get(planId);
    const request = this.requests.get(plan.requestId);

    if (!this.approvals.approvedForPlan(plan.id)) {
      throw new Error(
        "Evolution plan requires approved human authorization."
      );
    }

    if (!["approved", "executing"].includes(plan.status)) {
      throw new Error(
        `Evolution plan cannot start from status ${plan.status}.`
      );
    }

    this.plans.updateStatus(
      plan.id,
      "executing",
      actorIdentityId
    );

    this.requests.updateStatus(
      request.id,
      "executing",
      actorIdentityId
    );

    for (const step of plan.steps) {
      const id = this.executionId(plan.id, step.id);

      if (!this.executions.has(id)) {
        this.executions.set(id, {
          id,
          planId: plan.id,
          stepId: step.id,
          attempt: 0,
          status: "pending",
          input: {
            action: step.action,
            targetAssetId: step.targetAssetId,
            metadata: step.metadata
          },
          updatedAt: new Date().toISOString()
        });
      }
    }

    return this.advance(plan.id, actorIdentityId);
  }

  advance(planId: string, actorIdentityId: string) {
    const plan = this.plans.get(planId);
    const request = this.requests.get(plan.requestId);
    const executions = this.byPlan(plan.id);

    if (
      executions.some(
        (execution) => execution.status === "failed"
      )
    ) {
      this.plans.updateStatus(
        plan.id,
        "failed",
        actorIdentityId
      );

      this.requests.updateStatus(
        request.id,
        "failed",
        actorIdentityId
      );

      return this.snapshot(plan.id);
    }

    for (const step of plan.steps) {
      const execution = executions.find(
        (item) => item.stepId === step.id
      );

      if (!execution || execution.status !== "pending") {
        continue;
      }

      const dependenciesCompleted =
        step.dependsOnStepIds.every(
          (dependencyId) =>
            executions.some(
              (item) =>
                item.stepId === dependencyId &&
                item.status === "completed"
            )
        );

      if (!dependenciesCompleted) {
        continue;
      }

      this.executions.set(execution.id, {
        ...execution,
        status: "running",
        startedAt:
          execution.startedAt ??
          new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      this.plans.updateStep(
        plan.id,
        step.id,
        { status: "running" }
      );

      this.audit.record({
        correlationId: request.correlationId,
        category: "execution",
        action: "evolution-step-started",
        subjectId: execution.id,
        actorIdentityId,
        outcome: "pending",
        metadata: {
          planId: plan.id,
          stepId: step.id,
          targetAssetId: step.targetAssetId
        }
      });

      break;
    }

    const refreshed = this.byPlan(plan.id);

    if (
      refreshed.length > 0 &&
      refreshed.every(
        (execution) =>
          execution.status === "completed" ||
          execution.status === "skipped"
      )
    ) {
      this.plans.updateStatus(
        plan.id,
        "completed",
        actorIdentityId
      );

      this.requests.updateStatus(
        request.id,
        "completed",
        actorIdentityId
      );

      this.history.record({
        requestId: request.id,
        planId: plan.id,
        blueprintId: request.blueprintId,
        action: "evolution-completed",
        actorIdentityId,
        nextStatus: "completed",
        metadata: {}
      });
    }

    return this.snapshot(plan.id);
  }

  completeStep(
    planId: string,
    stepId: string,
    input: {
      success: boolean;
      actorIdentityId: string;
      output?: Record<string, unknown>;
      error?: string;
    }
  ) {
    const plan = this.plans.get(planId);
    const request = this.requests.get(plan.requestId);
    const step = plan.steps.find(
      (item) => item.id === stepId
    );

    if (!step) {
      throw new Error(
        `Evolution step not found: ${stepId}`
      );
    }

    const executionId = this.executionId(plan.id, step.id);
    const current = this.executions.get(executionId);

    if (!current) {
      throw new Error(
        `Evolution execution not found: ${executionId}`
      );
    }

    const attempt = current.attempt + 1;
    const now = new Date().toISOString();

    if (input.success) {
      this.executions.set(executionId, {
        ...current,
        attempt,
        status: "completed",
        output: input.output ?? {},
        error: undefined,
        completedAt: now,
        updatedAt: now
      });

      this.plans.updateStep(
        plan.id,
        step.id,
        { status: "completed" }
      );

      this.audit.record({
        correlationId: request.correlationId,
        category: "execution",
        action: "evolution-step-completed",
        subjectId: executionId,
        actorIdentityId: input.actorIdentityId,
        outcome: "success",
        metadata: {
          planId,
          stepId,
          attempt
        }
      });
    }
    else if (attempt >= step.maxAttempts) {
      this.executions.set(executionId, {
        ...current,
        attempt,
        status: "failed",
        error: input.error ?? "Evolution step failed.",
        completedAt: now,
        updatedAt: now
      });

      this.plans.updateStep(
        plan.id,
        step.id,
        { status: "failed" }
      );

      this.audit.record({
        correlationId: request.correlationId,
        category: "execution",
        action: "evolution-step-failed",
        subjectId: executionId,
        actorIdentityId: input.actorIdentityId,
        outcome: "failure",
        metadata: {
          planId,
          stepId,
          attempt,
          error: input.error
        }
      });
    }
    else {
      this.executions.set(executionId, {
        ...current,
        attempt,
        status: "pending",
        error: input.error ?? "Evolution step failed.",
        updatedAt: now
      });

      this.plans.updateStep(
        plan.id,
        step.id,
        { status: "pending" }
      );

      this.audit.record({
        correlationId: request.correlationId,
        category: "execution",
        action: "evolution-step-retry-scheduled",
        subjectId: executionId,
        actorIdentityId: input.actorIdentityId,
        outcome: "pending",
        metadata: {
          planId,
          stepId,
          attempt,
          maxAttempts: step.maxAttempts
        }
      });
    }

    return this.advance(
      plan.id,
      input.actorIdentityId
    );
  }

  snapshot(planId: string) {
    return {
      plan: this.plans.get(planId),
      executions: this.byPlan(planId)
    };
  }

  summary() {
    const executions = this.list();

    return {
      total: executions.length,
      pending: executions.filter(
        (execution) => execution.status === "pending"
      ).length,
      running: executions.filter(
        (execution) => execution.status === "running"
      ).length,
      completed: executions.filter(
        (execution) => execution.status === "completed"
      ).length,
      failed: executions.filter(
        (execution) => execution.status === "failed"
      ).length
    };
  }

  private executionId(
    planId: string,
    stepId: string
  ) {
    return `evolution-execution:${planId}:${stepId}`;
  }
}
