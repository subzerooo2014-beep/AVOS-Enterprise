import { Injectable } from "@nestjs/common";
import {
  KernelExecutionPlan,
  KernelExecutionStep,
  KernelOrchestrationTrace
} from "../enterprise-kernel-mega-pack-5.types";
import { KernelCommandBusService } from "../commands/kernel-command-bus.service";
import { KernelMessagingAuditService } from "../observability/kernel-messaging-audit.service";

@Injectable()
export class KernelOrchestrationService {
  private readonly plans = new Map<string, KernelExecutionPlan>();
  private readonly traces: KernelOrchestrationTrace[] = [];

  constructor(
    private readonly commands: KernelCommandBusService,
    private readonly audit: KernelMessagingAuditService
  ) {}

  createPlan(input: {
    name: string;
    description: string;
    steps: Array<Omit<
      KernelExecutionStep,
      "status" | "startedAt" | "completedAt" | "result" | "error"
    >>;
    correlationId: string;
    traceId?: string;
    createdByIdentityId: string;
    reversible: boolean;
  }) {
    this.validateSteps(input.steps);

    const now = new Date().toISOString();

    const plan: KernelExecutionPlan = {
      id: `kernel-execution-plan:${Date.now()}:${this.plans.size + 1}`,
      name: input.name,
      description: input.description,
      status: "ready",
      steps: input.steps
        .map((step) => ({
          ...step,
          dependencies: Array.from(new Set(step.dependencies)),
          status: "pending" as const
        }))
        .sort((left, right) => left.order - right.order),
      correlationId: input.correlationId,
      traceId: input.traceId ?? `trace:${Date.now()}`,
      createdByIdentityId: input.createdByIdentityId,
      reversible: input.reversible,
      createdAt: now,
      updatedAt: now
    };

    this.plans.set(plan.id, plan);
    this.trace(plan, undefined, "plan-created", "ready", {});

    this.audit.record({
      correlationId: input.correlationId,
      category: "orchestration",
      action: "kernel-execution-plan-created",
      subjectId: plan.id,
      actorIdentityId: input.createdByIdentityId,
      outcome: "success",
      metadata: {
        steps: plan.steps.length,
        reversible: plan.reversible
      }
    });

    return plan;
  }

  listPlans() {
    return Array.from(this.plans.values());
  }

  getPlan(id: string) {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new Error(`Kernel execution plan not found: ${id}`);
    }

    return plan;
  }

  approve(input: {
    planId: string;
    approvedByIdentityId: string;
    correlationId: string;
  }) {
    const current = this.getPlan(input.planId);

    const updated: KernelExecutionPlan = {
      ...current,
      approvedByIdentityId: input.approvedByIdentityId,
      updatedAt: new Date().toISOString()
    };

    this.plans.set(updated.id, updated);
    this.trace(updated, undefined, "plan-approved", updated.status, {
      approvedByIdentityId: input.approvedByIdentityId
    });

    return updated;
  }

  execute(input: {
    planId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.getPlan(input.planId);

    const requiresApproval = current.steps.some(
      (step) => step.requiresHumanApproval
    );

    if (requiresApproval && !current.approvedByIdentityId) {
      const waiting: KernelExecutionPlan = {
        ...current,
        status: "waiting-approval",
        updatedAt: new Date().toISOString()
      };

      this.plans.set(waiting.id, waiting);
      this.trace(waiting, undefined, "plan-waiting-approval", waiting.status, {});

      return waiting;
    }

    const running: KernelExecutionPlan = {
      ...current,
      status: "running",
      steps: current.steps.map((step) => ({ ...step })),
      updatedAt: new Date().toISOString()
    };

    this.plans.set(running.id, running);
    this.trace(running, undefined, "plan-started", running.status, {});

    try {
      for (const step of running.steps) {
        const dependenciesCompleted = step.dependencies.every((dependencyId) =>
          running.steps.some(
            (candidate) =>
              candidate.id === dependencyId &&
              candidate.status === "completed"
          )
        );

        if (!dependenciesCompleted) {
          step.status = "skipped";
          step.error = "Step dependencies are not completed.";
          continue;
        }

        step.status = "running";
        step.startedAt = new Date().toISOString();

        this.trace(running, step.id, "step-started", step.status, {});

        const dispatched = this.commands.dispatch({
          contractId: step.commandContractId,
          payload: step.payload,
          producerId: "kernel:orchestrator",
          actorIdentityId: input.actorIdentityId,
          correlationId: input.correlationId,
          traceId: running.traceId
        });

        if (!dispatched.result.success) {
          step.status = "failed";
          step.error = dispatched.result.error;
          step.completedAt = new Date().toISOString();
          throw new Error(step.error ?? "Kernel orchestration step failed.");
        }

        step.status = "completed";
        step.result = dispatched.result.result;
        step.completedAt = new Date().toISOString();

        this.trace(running, step.id, "step-completed", step.status, {
          result: step.result
        });
      }

      const failedOrSkipped = running.steps.some(
        (step) => step.status === "failed" || step.status === "skipped"
      );

      const completed: KernelExecutionPlan = {
        ...running,
        status: failedOrSkipped ? "failed" : "completed",
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      this.plans.set(completed.id, completed);
      this.trace(completed, undefined, "plan-finished", completed.status, {});

      return completed;
    }
    catch (error) {
      const failed: KernelExecutionPlan = {
        ...running,
        status: "failed",
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      this.plans.set(failed.id, failed);
      this.trace(failed, undefined, "plan-failed", failed.status, {
        error: error instanceof Error ? error.message : String(error)
      });

      if (failed.reversible) {
        return this.compensate({
          planId: failed.id,
          actorIdentityId: input.actorIdentityId,
          correlationId: input.correlationId
        });
      }

      return failed;
    }
  }

  compensate(input: {
    planId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.getPlan(input.planId);

    if (!current.reversible) {
      throw new Error("Kernel execution plan is not reversible.");
    }

    const compensating: KernelExecutionPlan = {
      ...current,
      status: "compensating",
      steps: current.steps.map((step) => ({ ...step })),
      updatedAt: new Date().toISOString()
    };

    const completedSteps = compensating.steps
      .filter((step) => step.status === "completed")
      .sort((left, right) => right.order - left.order);

    for (const step of completedSteps) {
      if (!step.compensationCommandContractId) {
        continue;
      }

      step.status = "compensating";

      const dispatched = this.commands.dispatch({
        contractId: step.compensationCommandContractId,
        payload: step.compensationPayload ?? {
          executionId: step.id
        },
        producerId: "kernel:orchestrator",
        actorIdentityId: input.actorIdentityId,
        correlationId: input.correlationId,
        traceId: compensating.traceId
      });

      step.status = dispatched.result.success
        ? "compensated"
        : "failed";

      step.result = dispatched.result.result;
      step.error = dispatched.result.error;
    }

    const compensationFailed = completedSteps.some(
      (step) => step.status === "failed"
    );

    const finalPlan: KernelExecutionPlan = {
      ...compensating,
      status: compensationFailed ? "failed" : "compensated",
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    this.plans.set(finalPlan.id, finalPlan);
    this.trace(finalPlan, undefined, "plan-compensated", finalPlan.status, {});

    return finalPlan;
  }

  listTraces() {
    return [...this.traces];
  }

  summary() {
    const plans = this.listPlans();

    return {
      total: plans.length,
      ready: plans.filter((x) => x.status === "ready").length,
      running: plans.filter((x) => x.status === "running").length,
      waitingApproval: plans.filter((x) => x.status === "waiting-approval").length,
      completed: plans.filter((x) => x.status === "completed").length,
      failed: plans.filter((x) => x.status === "failed").length,
      compensated: plans.filter((x) => x.status === "compensated").length,
      traces: this.traces.length
    };
  }

  private validateSteps(
    steps: Array<Omit<
      KernelExecutionStep,
      "status" | "startedAt" | "completedAt" | "result" | "error"
    >>
  ) {
    const ids = new Set(steps.map((step) => step.id));

    if (ids.size !== steps.length) {
      throw new Error("Kernel execution plan contains duplicate step ids.");
    }

    for (const step of steps) {
      for (const dependencyId of step.dependencies) {
        if (!ids.has(dependencyId)) {
          throw new Error(
            `Kernel execution step dependency not found: ${dependencyId}`
          );
        }
      }
    }
  }

  private trace(
    plan: KernelExecutionPlan,
    stepId: string | undefined,
    event: string,
    status: string,
    details: Record<string, unknown>
  ) {
    this.traces.push({
      id: `kernel-orchestration-trace:${Date.now()}:${this.traces.length + 1}`,
      planId: plan.id,
      stepId,
      event,
      status,
      details,
      correlationId: plan.correlationId,
      traceId: plan.traceId,
      occurredAt: new Date().toISOString()
    });
  }
}
