import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  NervousWorkflowExecution,
  NervousWorkflowStepExecution
} from "../enterprise-nervous-system-mega-pack-3.types";
import { NervousWorkflowRegistryService } from "../registry/nervous-workflow-registry.service";
import { NervousWorkflowTriggerService } from "../triggers/nervous-workflow-trigger.service";
import { NervousWorkflowStateService } from "../state/nervous-workflow-state.service";
import { NervousWorkflowApprovalService } from "../approval/nervous-workflow-approval.service";
import { NervousCompensationService } from "../compensation/nervous-compensation.service";
import { NervousWorkflowAuditService } from "../observability/nervous-workflow-audit.service";

@Injectable()
export class NervousWorkflowRuntimeService {
  private readonly executions =
    new Map<string, NervousWorkflowExecution>();

  constructor(
    private readonly workflows: NervousWorkflowRegistryService,
    private readonly triggers: NervousWorkflowTriggerService,
    private readonly states: NervousWorkflowStateService,
    private readonly approvals: NervousWorkflowApprovalService,
    private readonly compensation: NervousCompensationService,
    private readonly audit: NervousWorkflowAuditService
  ) {}

  list() {
    return Array.from(this.executions.values());
  }

  get(id: string) {
    const execution = this.executions.get(id);

    if (!execution) {
      throw new NotFoundException(`Workflow execution not found: ${id}`);
    }

    return execution;
  }

  start(input: {
    workflowId: string;
    triggerId?: string;
    context: Record<string, unknown>;
    correlationId: string;
    traceId?: string;
    startedByIdentityId: string;
  }) {
    const workflow = this.workflows.get(input.workflowId);

    if (workflow.status !== "active") {
      throw new ConflictException(
        `Workflow is not active: ${workflow.status}`
      );
    }

    if (input.triggerId) {
      const trigger = this.triggers.get(input.triggerId);

      if (trigger.workflowId !== workflow.id) {
        throw new ConflictException(
          "Trigger does not belong to workflow."
        );
      }
    }

    const now = new Date().toISOString();

    const steps: NervousWorkflowStepExecution[] =
      workflow.steps.map((step) => ({
        id: `workflow-step-execution:${Date.now()}:${step.id}`,
        stepId: step.id,
        status: "pending",
        attempts: 0,
        input: {}
      }));

    const execution: NervousWorkflowExecution = {
      id: `workflow-execution:${Date.now()}:${this.executions.size + 1}`,
      workflowId: workflow.id,
      workflowVersion: workflow.version,
      triggerId: input.triggerId,
      correlationId: input.correlationId,
      traceId:
        input.traceId ?? `workflow-trace:${Date.now()}`,
      status: "created",
      context: input.context,
      steps,
      progress: 0,
      startedByIdentityId: input.startedByIdentityId,
      startedAt: now,
      updatedAt: now
    };

    this.executions.set(execution.id, execution);

    this.transition(
      execution,
      "running",
      "Workflow execution started.",
      input.startedByIdentityId
    );

    return this.runAvailableSteps(execution.id);
  }

  resumeAfterApproval(input: {
    executionId: string;
    gateId: string;
    actorIdentityId: string;
  }) {
    const execution = this.get(input.executionId);
    const gate = this.approvals.get(input.gateId);

    if (gate.executionId !== execution.id) {
      throw new ConflictException(
        "Approval gate does not belong to execution."
      );
    }

    const step = execution.steps.find(
      (item) => item.stepId === gate.stepId
    );

    if (!step) {
      throw new NotFoundException(
        `Workflow step execution not found: ${gate.stepId}`
      );
    }

    if (gate.status === "rejected") {
      step.status = "failed";
      step.error = "Human approval rejected.";

      const updated = this.transition(
        execution,
        "failed",
        "Human approval rejected.",
        input.actorIdentityId
      );

      return this.compensateIfNeeded(updated, input.actorIdentityId);
    }

    if (gate.status !== "approved") {
      throw new ConflictException("Approval gate is still pending.");
    }

    step.status = "completed";
    step.approvedByIdentityId = gate.decidedByIdentityId;
    step.completedAt = new Date().toISOString();

    const resumed = this.transition(
      execution,
      "running",
      "Human approval granted.",
      input.actorIdentityId
    );

    return this.runAvailableSteps(resumed.id);
  }

  runAvailableSteps(executionId: string) {
    const execution = this.get(executionId);
    const workflow = this.workflows.get(execution.workflowId);

    for (const stepDefinition of workflow.steps) {
      if (stepDefinition.type === "compensation") {
        continue;
      }

      const stepExecution = execution.steps.find(
        (item) => item.stepId === stepDefinition.id
      );

      if (
        !stepExecution ||
        stepExecution.status === "completed" ||
        stepExecution.status === "running" ||
        stepExecution.status === "waiting-human-approval"
      ) {
        continue;
      }

      const dependenciesCompleted =
        stepDefinition.dependencies.every(
          (dependencyId) =>
            execution.steps.some(
              (candidate) =>
                candidate.stepId === dependencyId &&
                candidate.status === "completed"
            )
        );

      if (!dependenciesCompleted) {
        continue;
      }

      if (
        stepDefinition.requiresHumanApproval ||
        stepDefinition.type === "approval"
      ) {
        stepExecution.status = "waiting-human-approval";

        const gate = this.approvals.create({
          executionId: execution.id,
          stepId: stepDefinition.id,
          reason: stepDefinition.description,
          riskScore: 80,
          requestedByIdentityId: execution.startedByIdentityId,
          correlationId: execution.correlationId
        });

        const waiting = this.transition(
          execution,
          "waiting-human-approval",
          `Waiting for approval gate ${gate.id}.`,
          execution.startedByIdentityId
        );

        this.executions.set(waiting.id, waiting);

        return {
          execution: waiting,
          approvalGate: gate
        };
      }

      stepExecution.status = "running";
      stepExecution.startedAt = new Date().toISOString();
      stepExecution.attempts += 1;

      try {
        stepExecution.output = {
          executed: true,
          stepType: stepDefinition.type,
          workflowId: workflow.id
        };
        stepExecution.status = "completed";
        stepExecution.completedAt = new Date().toISOString();
        execution.context[
          stepDefinition.outputKey ?? stepDefinition.id
        ] = stepExecution.output;
      }
      catch (error) {
        stepExecution.status = "failed";
        stepExecution.error =
          error instanceof Error
            ? error.message
            : String(error);

        const failed = this.transition(
          execution,
          "failed",
          `Workflow step failed: ${stepDefinition.id}`,
          execution.startedByIdentityId
        );

        return this.compensateIfNeeded(
          failed,
          execution.startedByIdentityId
        );
      }
    }

    const runnableSteps = workflow.steps.filter(
      (step) => step.type !== "compensation"
    );

    const completed =
      runnableSteps.every(
        (step) =>
          execution.steps.some(
            (candidate) =>
              candidate.stepId === step.id &&
              candidate.status === "completed"
          )
      );

    execution.progress =
      runnableSteps.length === 0
        ? 100
        : Number(
            (
              execution.steps.filter(
                (step) =>
                  runnableSteps.some(
                    (definition) =>
                      definition.id === step.stepId
                  ) &&
                  step.status === "completed"
              ).length /
              runnableSteps.length *
              100
            ).toFixed(2)
          );

    if (completed) {
      const finalExecution = this.transition(
        execution,
        "completed",
        "All workflow steps completed.",
        execution.startedByIdentityId
      );

      finalExecution.progress = 100;
      finalExecution.completedAt = new Date().toISOString();
      this.executions.set(finalExecution.id, finalExecution);

      return {
        execution: finalExecution
      };
    }

    execution.updatedAt = new Date().toISOString();
    this.executions.set(execution.id, execution);

    return {
      execution
    };
  }

  startFromSignal(input: {
    topic: string;
    signalDefinitionId?: string;
    payload: unknown;
    context: Record<string, unknown>;
    correlationId: string;
    traceId?: string;
    startedByIdentityId: string;
  }) {
    const matches = this.triggers.match({
      topic: input.topic,
      signalDefinitionId: input.signalDefinitionId,
      payload: input.payload
    });

    return matches.map((trigger) =>
      this.start({
        workflowId: trigger.workflowId,
        triggerId: trigger.id,
        context: {
          ...input.context,
          signalPayload: input.payload,
          signalTopic: input.topic
        },
        correlationId: input.correlationId,
        traceId: input.traceId,
        startedByIdentityId: input.startedByIdentityId
      })
    );
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      running: items.filter((x) => x.status === "running").length,
      waitingHumanApproval:
        items.filter(
          (x) => x.status === "waiting-human-approval"
        ).length,
      compensating:
        items.filter((x) => x.status === "compensating").length,
      completed: items.filter((x) => x.status === "completed").length,
      failed: items.filter((x) => x.status === "failed").length,
      cancelled: items.filter((x) => x.status === "cancelled").length
    };
  }

  private transition(
    execution: NervousWorkflowExecution,
    toStatus: NervousWorkflowExecution["status"],
    reason: string,
    actorIdentityId: string
  ) {
    this.states.transition({
      executionId: execution.id,
      fromStatus: execution.status,
      toStatus,
      reason,
      actorIdentityId
    });

    const updated: NervousWorkflowExecution = {
      ...execution,
      steps: execution.steps.map((step) => ({ ...step })),
      status: toStatus,
      updatedAt: new Date().toISOString()
    };

    this.executions.set(updated.id, updated);

    this.audit.record({
      correlationId: updated.correlationId,
      category: "state",
      action: "workflow-state-transitioned",
      subjectId: updated.id,
      actorIdentityId,
      outcome:
        toStatus === "failed"
          ? "failure"
          : toStatus === "waiting-human-approval"
            ? "warning"
            : "success",
      metadata: {
        toStatus,
        reason
      }
    });

    return updated;
  }

  private compensateIfNeeded(
    execution: NervousWorkflowExecution,
    actorIdentityId: string
  ) {
    const workflow = this.workflows.get(execution.workflowId);

    if (!workflow.reversible) {
      return {
        execution
      };
    }

    const compensating = this.transition(
      execution,
      "compensating",
      "Starting workflow compensation.",
      actorIdentityId
    );

    const compensation = this.compensation.compensate({
      execution: compensating,
      workflow,
      actorIdentityId,
      correlationId: compensating.correlationId
    });

    const finalExecution = this.transition(
      compensating,
      compensation.failed.length === 0
        ? "completed"
        : "failed",
      compensation.failed.length === 0
        ? "Workflow compensation completed."
        : "Workflow compensation failed.",
      actorIdentityId
    );

    finalExecution.completedAt = new Date().toISOString();
    this.executions.set(finalExecution.id, finalExecution);

    return {
      execution: finalExecution,
      compensation
    };
  }
}
