import { Injectable } from "@nestjs/common";
import {
  KernelPipelineExecution,
  KernelPipelineStep
} from "../enterprise-kernel-mega-pack-1.types";
import { KernelStateService } from "../state/kernel-state.service";
import { KernelModuleRegistryService } from "../modules/kernel-module-registry.service";
import { KernelLifecycleService } from "../lifecycle/kernel-lifecycle.service";
import { KernelAuditService } from "../observability/kernel-audit.service";

@Injectable()
export class KernelShutdownPipelineService {
  private readonly executions =
    new Map<string, KernelPipelineExecution>();

  constructor(
    private readonly state: KernelStateService,
    private readonly modules: KernelModuleRegistryService,
    private readonly lifecycle: KernelLifecycleService,
    private readonly audit: KernelAuditService
  ) {}

  list() {
    return Array.from(this.executions.values());
  }

  execute(input: {
    actorIdentityId: string;
    correlationId: string;
    reason?: string;
  }) {
    const execution: KernelPipelineExecution = {
      id: `kernel-shutdown-pipeline:${Date.now()}:${
        this.executions.size + 1
      }`,
      type: "shutdown",
      status: "running",
      actorIdentityId: input.actorIdentityId,
      correlationId: input.correlationId,
      steps: this.steps(),
      startedAt: new Date().toISOString()
    };

    this.executions.set(execution.id, execution);

    this.state.transition({
      status: "stopping",
      actorIdentityId: input.actorIdentityId,
      correlationId: input.correlationId,
      metadata: {
        shutdownReason:
          input.reason ?? "Controlled shutdown."
      }
    });

    try {
      this.runStep(
        execution,
        "shutdown:modules",
        () => {
          const active = this.modules
            .list()
            .filter(
              (module) =>
                module.stage === "active" ||
                module.stage === "suspended"
            )
            .sort(
              (left, right) =>
                right.transitionCount -
                left.transitionCount
            );

          const results = [];

          for (const module of active) {
            results.push(
              this.lifecycle.execute({
                moduleId: module.id,
                action: "deactivate",
                actorIdentityId:
                  input.actorIdentityId,
                correlationId:
                  input.correlationId,
                reason:
                  input.reason ??
                  "Controlled kernel shutdown."
              })
            );
          }

          return results;
        }
      );

      this.runStep(
        execution,
        "shutdown:runtime",
        () =>
          this.state.transition({
            status: "stopped",
            actorIdentityId:
              input.actorIdentityId,
            correlationId: input.correlationId
          })
      );

      execution.status = "completed";
      execution.completedAt =
        new Date().toISOString();

      this.audit.record({
        correlationId: input.correlationId,
        category: "pipeline",
        action: "kernel-shutdown-pipeline-completed",
        subjectId: execution.id,
        actorIdentityId: input.actorIdentityId,
        outcome: "success",
        metadata: {
          reason:
            input.reason ??
            "Controlled shutdown."
        }
      });

      return execution;
    }
    catch (error) {
      execution.status = "failed";
      execution.completedAt =
        new Date().toISOString();

      this.state.recordFailure({
        code: "KERNEL_SHUTDOWN_FAILED",
        message:
          error instanceof Error
            ? error.message
            : "Unknown kernel shutdown failure.",
        actorIdentityId: input.actorIdentityId,
        correlationId: input.correlationId
      });

      throw error;
    }
  }

  summary() {
    const executions = this.list();

    return {
      total: executions.length,
      completed: executions.filter(
        (execution) =>
          execution.status === "completed"
      ).length,
      failed: executions.filter(
        (execution) =>
          execution.status === "failed"
      ).length
    };
  }

  private steps(): KernelPipelineStep[] {
    return [
      {
        id: "shutdown:modules",
        name: "Deactivate Kernel Modules",
        order: 1,
        required: true,
        status: "pending",
        details: {}
      },
      {
        id: "shutdown:runtime",
        name: "Enter Stopped State",
        order: 2,
        required: true,
        status: "pending",
        details: {}
      }
    ];
  }

  private runStep(
    execution: KernelPipelineExecution,
    stepId: string,
    action: () => unknown
  ) {
    const step = execution.steps.find(
      (item) => item.id === stepId
    );

    if (!step) {
      throw new Error(
        `Kernel shutdown pipeline step not found: ${stepId}`
      );
    }

    step.status = "running";
    step.startedAt = new Date().toISOString();

    try {
      const result = action();
      step.status = "completed";
      step.completedAt = new Date().toISOString();
      step.details = {
        result
      };
    }
    catch (error) {
      step.status = "failed";
      step.completedAt = new Date().toISOString();
      step.failureReason =
        error instanceof Error
          ? error.message
          : String(error);
      throw error;
    }
  }
}
