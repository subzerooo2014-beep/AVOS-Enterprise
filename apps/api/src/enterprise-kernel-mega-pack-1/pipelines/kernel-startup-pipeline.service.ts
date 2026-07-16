import { Injectable } from "@nestjs/common";
import {
  KernelPipelineExecution,
  KernelPipelineStep
} from "../enterprise-kernel-mega-pack-1.types";
import { KernelIdentityService } from "../identity/kernel-identity.service";
import { KernelContextService } from "../context/kernel-context.service";
import { KernelStateService } from "../state/kernel-state.service";
import { KernelLifecycleService } from "../lifecycle/kernel-lifecycle.service";
import { KernelAuditService } from "../observability/kernel-audit.service";

@Injectable()
export class KernelStartupPipelineService {
  private readonly executions =
    new Map<string, KernelPipelineExecution>();

  constructor(
    private readonly identity: KernelIdentityService,
    private readonly contexts: KernelContextService,
    private readonly state: KernelStateService,
    private readonly lifecycle: KernelLifecycleService,
    private readonly audit: KernelAuditService
  ) {}

  list() {
    return Array.from(this.executions.values());
  }

  execute(input: {
    actorIdentityId: string;
    correlationId: string;
    environment?: string;
    region?: string;
    nodeName?: string;
  }) {
    const execution: KernelPipelineExecution = {
      id: `kernel-startup-pipeline:${Date.now()}:${
        this.executions.size + 1
      }`,
      type: "startup",
      status: "running",
      actorIdentityId: input.actorIdentityId,
      correlationId: input.correlationId,
      steps: this.steps(),
      startedAt: new Date().toISOString()
    };

    this.executions.set(execution.id, execution);

    this.state.transition({
      status: "bootstrapping",
      actorIdentityId: input.actorIdentityId,
      correlationId: input.correlationId
    });

    try {
      this.runStep(
        execution,
        "startup:identity",
        () =>
          this.identity.verify({
            actorIdentityId: input.actorIdentityId,
            correlationId: input.correlationId
          })
      );

      this.runStep(
        execution,
        "startup:context",
        () =>
          this.contexts.create({
            environment: input.environment,
            region: input.region,
            nodeName: input.nodeName,
            startedByIdentityId:
              input.actorIdentityId,
            correlationId: input.correlationId
          })
      );

      this.state.transition({
        status: "starting",
        actorIdentityId: input.actorIdentityId,
        correlationId: input.correlationId
      });

      this.runStep(
        execution,
        "startup:modules",
        () =>
          this.lifecycle.bootstrapAutoModules({
            actorIdentityId:
              input.actorIdentityId,
            correlationId: input.correlationId
          })
      );

      this.runStep(
        execution,
        "startup:runtime",
        () =>
          this.state.transition({
            status: "running",
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
        action: "kernel-startup-pipeline-completed",
        subjectId: execution.id,
        actorIdentityId: input.actorIdentityId,
        outcome: "success",
        metadata: {
          steps: execution.steps.length
        }
      });

      return execution;
    }
    catch (error) {
      execution.status = "failed";
      execution.completedAt =
        new Date().toISOString();

      this.state.recordFailure({
        code: "KERNEL_STARTUP_FAILED",
        message:
          error instanceof Error
            ? error.message
            : "Unknown kernel startup failure.",
        actorIdentityId: input.actorIdentityId,
        correlationId: input.correlationId
      });

      this.audit.record({
        correlationId: input.correlationId,
        category: "pipeline",
        action: "kernel-startup-pipeline-failed",
        subjectId: execution.id,
        actorIdentityId: input.actorIdentityId,
        outcome: "failure",
        metadata: {
          error:
            error instanceof Error
              ? error.message
              : String(error)
        }
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
        id: "startup:identity",
        name: "Verify Kernel Identity",
        order: 1,
        required: true,
        status: "pending",
        details: {}
      },
      {
        id: "startup:context",
        name: "Create Runtime Context",
        order: 2,
        required: true,
        status: "pending",
        details: {}
      },
      {
        id: "startup:modules",
        name: "Bootstrap Auto Modules",
        order: 3,
        required: true,
        status: "pending",
        details: {}
      },
      {
        id: "startup:runtime",
        name: "Enter Running State",
        order: 4,
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
        `Kernel startup pipeline step not found: ${stepId}`
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
