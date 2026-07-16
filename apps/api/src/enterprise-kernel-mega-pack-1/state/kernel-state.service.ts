import { Injectable } from "@nestjs/common";
import {
  KernelRuntimeState,
  KernelRuntimeStatus
} from "../enterprise-kernel-mega-pack-1.types";
import { KernelAuditService } from "../observability/kernel-audit.service";

@Injectable()
export class KernelStateService {
  private state: KernelRuntimeState = {
    id: "enterprise-kernel-runtime-state",
    status: "created",
    bootCount: 0,
    activeModuleIds: [],
    suspendedModuleIds: [],
    failedModuleIds: [],
    metadata: {},
    updatedAt: new Date().toISOString()
  };

  constructor(
    private readonly audit: KernelAuditService
  ) {}

  get() {
    return {
      ...this.state,
      activeModuleIds: [...this.state.activeModuleIds],
      suspendedModuleIds: [...this.state.suspendedModuleIds],
      failedModuleIds: [...this.state.failedModuleIds],
      metadata: { ...this.state.metadata }
    };
  }

  transition(input: {
    status: KernelRuntimeStatus;
    actorIdentityId: string;
    correlationId: string;
    metadata?: Record<string, unknown>;
  }) {
    const previousStatus = this.state.status;
    const now = new Date().toISOString();

    this.state = {
      ...this.state,
      status: input.status,
      bootCount:
        input.status === "bootstrapping"
          ? this.state.bootCount + 1
          : this.state.bootCount,
      startupStartedAt:
        input.status === "bootstrapping"
          ? now
          : this.state.startupStartedAt,
      startedAt:
        input.status === "running"
          ? now
          : this.state.startedAt,
      shutdownStartedAt:
        input.status === "stopping"
          ? now
          : this.state.shutdownStartedAt,
      stoppedAt:
        input.status === "stopped"
          ? now
          : this.state.stoppedAt,
      metadata: {
        ...this.state.metadata,
        ...(input.metadata ?? {})
      },
      updatedAt: now
    };

    this.audit.record({
      correlationId: input.correlationId,
      category: "runtime",
      action: `kernel-runtime-status:${input.status}`,
      subjectId: this.state.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        input.status === "failed"
          ? "failure"
          : input.status === "degraded"
            ? "warning"
            : "success",
      metadata: {
        previousStatus,
        status: input.status
      }
    });

    return this.get();
  }

  setModuleState(input: {
    moduleId: string;
    stage:
      | "active"
      | "suspended"
      | "failed"
      | "inactive"
      | "removed";
  }) {
    const active = new Set(this.state.activeModuleIds);
    const suspended = new Set(
      this.state.suspendedModuleIds
    );
    const failed = new Set(this.state.failedModuleIds);

    active.delete(input.moduleId);
    suspended.delete(input.moduleId);
    failed.delete(input.moduleId);

    if (input.stage === "active") {
      active.add(input.moduleId);
    }

    if (input.stage === "suspended") {
      suspended.add(input.moduleId);
    }

    if (input.stage === "failed") {
      failed.add(input.moduleId);
    }

    this.state = {
      ...this.state,
      activeModuleIds: Array.from(active),
      suspendedModuleIds: Array.from(suspended),
      failedModuleIds: Array.from(failed),
      updatedAt: new Date().toISOString()
    };

    return this.get();
  }

  recordFailure(input: {
    code: string;
    message: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.state = {
      ...this.state,
      status: "failed",
      lastFailure: {
        code: input.code,
        message: input.message,
        occurredAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };

    this.audit.record({
      correlationId: input.correlationId,
      category: "runtime",
      action: "kernel-runtime-failure-recorded",
      subjectId: this.state.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "failure",
      metadata: {
        code: input.code,
        message: input.message
      }
    });

    return this.get();
  }
}
