import { Injectable } from "@nestjs/common";
import {
  OrchestrationStepExecution
} from "../foundation-pack-6.types";
import { AutonomousOrchestrationPlanService } from "../orchestration/autonomous-orchestration-plan.service";
import { HumanApprovalGateService } from "../approval/human-approval-gate.service";
import { DeadLetterQueueService } from "../recovery/dead-letter-queue.service";
import { NervousSystemTraceService } from "../observability/nervous-system-trace.service";

@Injectable()
export class AutonomousOrchestrationRuntimeService {
  private readonly executions =
    new Map<string, OrchestrationStepExecution>();

  constructor(
    private readonly plans: AutonomousOrchestrationPlanService,
    private readonly approvals: HumanApprovalGateService,
    private readonly deadLetters: DeadLetterQueueService,
    private readonly trace: NervousSystemTraceService
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

    if (!["ready", "waiting-human-approval", "running"].includes(plan.status)) {
      throw new Error(`Plan cannot start from status: ${plan.status}`);
    }

    this.plans.updateStatus(planId, "running", actorIdentityId);

    for (const step of plan.steps) {
      const executionId = this.executionId(plan.id, step.id);

      if (!this.executions.has(executionId)) {
        const execution: OrchestrationStepExecution = {
          id: executionId,
          planId: plan.id,
          stepId: step.id,
          capabilityId: step.capabilityId,
          action: step.action,
          status: "pending",
          attempt: 0,
          input: {
            ...plan.context,
            ...step.input
          },
          updatedAt: new Date().toISOString()
        };

        this.executions.set(execution.id, execution);
      }
    }

    return this.advance(planId, actorIdentityId);
  }

  advance(planId: string, actorIdentityId: string) {
    const plan = this.plans.get(planId);
    const executions = this.byPlan(planId);

    if (executions.some((execution) => execution.status === "failed")) {
      this.plans.updateStatus(planId, "failed", actorIdentityId);
      return this.snapshot(planId);
    }

    const pending = executions.filter(
      (execution) => execution.status === "pending"
    );

    for (const execution of pending) {
      const step = plan.steps.find(
        (candidate) => candidate.id === execution.stepId
      );

      if (!step) {
        continue;
      }

      const dependenciesCompleted = step.dependsOnStepIds.every(
        (dependencyId) =>
          executions.some(
            (candidate) =>
              candidate.stepId === dependencyId &&
              candidate.status === "completed"
          )
      );

      if (!dependenciesCompleted) {
        continue;
      }

      const approvalRequired =
        step.executionMode === "human-required" ||
        step.executionMode === "human-supervised";

      if (
        approvalRequired &&
        !this.approvals.approvedForStep(plan.id, step.id)
      ) {
        const existingRequest = this.approvals
          .byPlan(plan.id)
          .find(
            (request) =>
              request.stepId === step.id &&
              request.status === "pending"
          );

        if (!existingRequest) {
          this.approvals.request({
            planId: plan.id,
            stepId: step.id,
            requestedByIdentityId: actorIdentityId,
            requiredRole:
              step.requiredApprovalRole ?? "AVOS Human Authority",
            reason: `Approval required before executing ${step.action}.`,
            correlationId: plan.correlationId
          });
        }

        this.updateExecution(execution.id, {
          status: "waiting-human-approval"
        });

        this.plans.updateStatus(
          plan.id,
          "waiting-human-approval",
          actorIdentityId
        );

        return this.snapshot(plan.id);
      }

      this.executeStep(plan.id, step.id, actorIdentityId);
    }

    const refreshed = this.byPlan(planId);

    if (
      refreshed.length > 0 &&
      refreshed.every(
        (execution) =>
          execution.status === "completed" ||
          execution.status === "skipped"
      )
    ) {
      this.plans.updateStatus(planId, "completed", actorIdentityId);
    }
    else if (
      refreshed.some(
        (execution) =>
          execution.status === "waiting-human-approval"
      )
    ) {
      this.plans.updateStatus(
        planId,
        "waiting-human-approval",
        actorIdentityId
      );
    }
    else {
      this.plans.updateStatus(planId, "running", actorIdentityId);
    }

    return this.snapshot(planId);
  }

  resumeAfterApproval(
    planId: string,
    approvalRequestId: string,
    input: {
      approved: boolean;
      approverIdentityId: string;
      decisionNote: string;
    }
  ) {
    const plan = this.plans.get(planId);
    const approval = this.approvals.decide(approvalRequestId, {
      ...input,
      correlationId: plan.correlationId
    });

    const executionId = this.executionId(planId, approval.stepId);
    const execution = this.executions.get(executionId);

    if (!execution) {
      throw new Error(
        `Execution not found for approved step: ${approval.stepId}`
      );
    }

    if (!input.approved) {
      this.updateExecution(execution.id, {
        status: "cancelled",
        error: input.decisionNote
      });

      this.plans.updateStatus(
        planId,
        "cancelled",
        input.approverIdentityId
      );

      return this.snapshot(planId);
    }

    this.updateExecution(execution.id, {
      status: "pending",
      error: undefined
    });

    this.plans.updateStatus(
      planId,
      "running",
      input.approverIdentityId
    );

    return this.advance(planId, input.approverIdentityId);
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
    const step = plan.steps.find((candidate) => candidate.id === stepId);

    if (!step) {
      throw new Error(`Orchestration step not found: ${stepId}`);
    }

    const executionId = this.executionId(planId, stepId);
    const current = this.executions.get(executionId);

    if (!current) {
      throw new Error(`Orchestration execution not found: ${executionId}`);
    }

    const attempt = current.attempt + 1;
    const now = new Date().toISOString();

    if (input.success) {
      this.executions.set(executionId, {
        ...current,
        status: "completed",
        attempt,
        output: input.output ?? {},
        error: undefined,
        completedAt: now,
        updatedAt: now
      });

      this.trace.record({
        correlationId: plan.correlationId,
        category: "execution",
        action: "step-completed",
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
        status: "failed",
        attempt,
        error: input.error ?? "Execution failed",
        completedAt: now,
        updatedAt: now
      });

      this.deadLetters.add({
        sourceType: "orchestration-step",
        sourceId: executionId,
        correlationId: plan.correlationId,
        reason: input.error ?? "Execution attempts exhausted",
        attempts: attempt,
        payload: {
          planId,
          stepId,
          capabilityId: step.capabilityId,
          action: step.action,
          input: current.input
        }
      });

      this.trace.record({
        correlationId: plan.correlationId,
        category: "execution",
        action: "step-failed",
        subjectId: executionId,
        actorIdentityId: input.actorIdentityId,
        outcome: "failure",
        metadata: {
          planId,
          stepId,
          attempt,
          maxAttempts: step.maxAttempts,
          error: input.error
        }
      });
    }
    else {
      this.executions.set(executionId, {
        ...current,
        status: "pending",
        attempt,
        error: input.error ?? "Execution failed",
        updatedAt: now
      });

      this.trace.record({
        correlationId: plan.correlationId,
        category: "execution",
        action: "step-retry-scheduled",
        subjectId: executionId,
        actorIdentityId: input.actorIdentityId,
        outcome: "pending",
        metadata: {
          planId,
          stepId,
          attempt,
          maxAttempts: step.maxAttempts,
          error: input.error
        }
      });
    }

    return this.advance(planId, input.actorIdentityId);
  }

  snapshot(planId: string) {
    return {
      plan: this.plans.get(planId),
      executions: this.byPlan(planId),
      approvals: this.approvals.byPlan(planId)
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
      waitingHumanApproval: executions.filter(
        (execution) =>
          execution.status === "waiting-human-approval"
      ).length,
      completed: executions.filter(
        (execution) => execution.status === "completed"
      ).length,
      failed: executions.filter(
        (execution) => execution.status === "failed"
      ).length
    };
  }

  private executeStep(
    planId: string,
    stepId: string,
    actorIdentityId: string
  ) {
    const plan = this.plans.get(planId);
    const executionId = this.executionId(planId, stepId);
    const current = this.executions.get(executionId);

    if (!current) {
      throw new Error(`Execution not found: ${executionId}`);
    }

    const now = new Date().toISOString();

    this.executions.set(executionId, {
      ...current,
      status: "running",
      startedAt: current.startedAt ?? now,
      updatedAt: now
    });

    this.trace.record({
      correlationId: plan.correlationId,
      category: "execution",
      action: "step-started",
      subjectId: executionId,
      actorIdentityId,
      outcome: "pending",
      metadata: {
        planId,
        stepId,
        capabilityId: current.capabilityId,
        action: current.action
      }
    });
  }

  private updateExecution(
    executionId: string,
    patch: Partial<OrchestrationStepExecution>
  ) {
    const current = this.executions.get(executionId);

    if (!current) {
      throw new Error(`Execution not found: ${executionId}`);
    }

    this.executions.set(executionId, {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString()
    });
  }

  private executionId(planId: string, stepId: string) {
    return `orchestration-execution:${planId}:${stepId}`;
  }
}
