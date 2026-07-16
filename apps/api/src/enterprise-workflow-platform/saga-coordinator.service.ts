import { Injectable } from "@nestjs/common";
import { ApprovalGateService } from "./approval-gate.service";
import { WorkflowDefinitionRegistryService } from "./workflow-definition-registry.service";
import { WorkflowEventsService } from "./workflow-events.service";
import { WorkflowStateStoreService } from "./workflow-state-store.service";
import { WorkflowTimeoutManagerService } from "./workflow-timeout-manager.service";
import type {
  WorkflowExecution,
  WorkflowStepDefinition,
} from "./enterprise-workflow.types";

@Injectable()
export class SagaCoordinatorService {
  constructor(
    private readonly definitions: WorkflowDefinitionRegistryService,
    private readonly store: WorkflowStateStoreService,
    private readonly approvals: ApprovalGateService,
    private readonly timeouts: WorkflowTimeoutManagerService,
    private readonly events: WorkflowEventsService,
  ) {}

  start(
    definitionId: string,
    context: Record<string, unknown> = {},
    correlationId?: string,
  ): WorkflowExecution {
    const definition = this.definitions.get(definitionId);
    const firstStep = definition.steps[0];
    const now = new Date().toISOString();

    const execution: WorkflowExecution = {
      id: `wf-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      definitionId: definition.id,
      definitionVersion: definition.version,
      correlationId,
      status: firstStep?.requiresApproval ? "WAITING_APPROVAL" : "RUNNING",
      currentStepId: firstStep?.id,
      context: { ...context },
      steps: definition.steps.map((step) => ({
        stepId: step.id,
        status: "PENDING",
        attempts: 0,
      })),
      createdAt: now,
      updatedAt: now,
    };

    if (firstStep?.requiresApproval) {
      this.approvals.create(execution.id, firstStep.id);
    }

    if (firstStep?.timeoutMs) {
      this.timeouts.schedule(execution.id, firstStep.timeoutMs);
    }

    const saved = this.store.save(execution);
    this.events.emit("WorkflowStarted", saved.id, {
      definitionId: saved.definitionId,
      version: saved.definitionVersion,
    });

    return saved;
  }

  advance(executionId: string): WorkflowExecution {
    const execution = this.store.get(executionId);
    const definition = this.definitions.get(
      execution.definitionId,
      execution.definitionVersion,
    );

    if (this.timeouts.isTimedOut(executionId)) {
      execution.status = "TIMED_OUT";
      execution.failureReason = "Workflow execution timed out.";
      execution.completedAt = new Date().toISOString();
      const timedOut = this.store.save(execution);
      this.events.emit("WorkflowTimedOut", executionId);
      return timedOut;
    }

    const currentIndex = definition.steps.findIndex(
      (step) => step.id === execution.currentStepId,
    );

    if (currentIndex < 0) {
      execution.status = "FAILED";
      execution.failureReason = "Current workflow step could not be resolved.";
      return this.store.save(execution);
    }

    const currentDefinition = definition.steps[currentIndex];
    const currentExecution = execution.steps.find(
      (step) => step.stepId === currentDefinition.id,
    );

    if (currentDefinition.requiresApproval) {
      const approval = this.approvals
        .list()
        .find(
          (item) =>
            item.workflowExecutionId === executionId &&
            item.stepId === currentDefinition.id,
        );

      if (!approval || approval.status === "PENDING") {
        execution.status = "WAITING_APPROVAL";
        return this.store.save(execution);
      }

      if (approval.status === "REJECTED") {
        execution.status = "FAILED";
        execution.failureReason = approval.reason ?? "Approval rejected.";
        return this.store.save(execution);
      }
    }

    if (currentExecution) {
      currentExecution.status = "COMPLETED";
      currentExecution.attempts += 1;
      currentExecution.startedAt ??= new Date().toISOString();
      currentExecution.completedAt = new Date().toISOString();
    }

    const nextStep = definition.steps[currentIndex + 1];

    if (!nextStep) {
      execution.status = "COMPLETED";
      execution.currentStepId = undefined;
      execution.completedAt = new Date().toISOString();
      this.timeouts.cancel(executionId);
      const completed = this.store.save(execution);
      this.events.emit("WorkflowCompleted", executionId);
      return completed;
    }

    this.prepareNextStep(execution, nextStep);
    const saved = this.store.save(execution);
    this.events.emit("WorkflowAdvanced", executionId, {
      nextStepId: nextStep.id,
    });

    return saved;
  }

  fail(executionId: string, reason: string): WorkflowExecution {
    const execution = this.store.get(executionId);
    execution.status = "FAILED";
    execution.failureReason = reason;
    const saved = this.store.save(execution);
    this.events.emit("WorkflowFailed", executionId, { reason });
    return saved;
  }

  private prepareNextStep(
    execution: WorkflowExecution,
    nextStep: WorkflowStepDefinition,
  ): void {
    execution.currentStepId = nextStep.id;
    execution.status = nextStep.requiresApproval ? "WAITING_APPROVAL" : "RUNNING";

    if (nextStep.requiresApproval) {
      this.approvals.create(execution.id, nextStep.id);
    }

    if (nextStep.timeoutMs) {
      this.timeouts.schedule(execution.id, nextStep.timeoutMs);
    }
  }
}
