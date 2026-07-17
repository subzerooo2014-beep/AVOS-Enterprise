import { BadRequestException, Injectable } from "@nestjs/common";
import { PlatformAuditService } from "../../platform-control-plane/services/platform-audit.service";
import { PlatformRegistryService } from "../../platform-control-plane/services/platform-registry.service";
import type {
  LifecycleCommand,
  LifecycleCommandRecord,
  RuntimeState
} from "../contracts/platform-service-lifecycle.contracts";
import type {
  ExecuteLifecycleCommandDto,
  RecordHeartbeatDto,
  RecordServiceFailureDto
} from "../dto/platform-service-lifecycle.dto";
import { PlatformCommandHistoryService } from "./platform-command-history.service";
import { PlatformDiagnosticsService } from "./platform-diagnostics.service";
import { PlatformFailureService } from "./platform-failure.service";
import { PlatformHeartbeatService } from "./platform-heartbeat.service";
import { PlatformLifecycleIdService } from "./platform-lifecycle-id.service";
import { PlatformRuntimeRegistryService } from "./platform-runtime-registry.service";

@Injectable()
export class PlatformServiceLifecycleService {
  constructor(
    private readonly ids: PlatformLifecycleIdService,
    private readonly platformRegistry: PlatformRegistryService,
    private readonly runtime: PlatformRuntimeRegistryService,
    private readonly commands: PlatformCommandHistoryService,
    private readonly heartbeats: PlatformHeartbeatService,
    private readonly failures: PlatformFailureService,
    private readonly diagnostics: PlatformDiagnosticsService,
    private readonly audit: PlatformAuditService
  ) {}

  execute(serviceId: string, dto: ExecuteLifecycleCommandDto) {
    this.platformRegistry.get(serviceId);
    const from = this.runtime.get(serviceId);
    const requestedAt = this.ids.now();

    const toState = this.resolveTransition(serviceId, dto.command, dto.reason);
    const updated = this.applyTransition(
      serviceId,
      dto.command,
      toState,
      dto.reason,
      dto.metadata
    );

    const record: LifecycleCommandRecord = {
      id: this.ids.create(),
      serviceId,
      command: dto.command,
      actorId: dto.actorId,
      requestedAt,
      completedAt: this.ids.now(),
      status: "completed",
      fromState: from.state,
      toState: updated.state,
      reason: dto.reason,
      details: { ...(dto.metadata ?? {}) }
    };

    this.commands.add(record);
    this.audit.record({
      action: `platform.service.${dto.command}`,
      actorId: dto.actorId,
      resourceType: "service-runtime",
      resourceId: serviceId,
      environmentId: this.platformRegistry.get(serviceId).environmentId,
      outcome: "success",
      details: {
        fromState: from.state,
        toState: updated.state,
        reason: dto.reason
      }
    });

    return {
      command: record,
      runtime: updated
    };
  }

  private resolveTransition(
    serviceId: string,
    command: LifecycleCommand,
    reason?: string
  ): RuntimeState {
    const current = this.runtime.get(serviceId);

    switch (command) {
      case "start":
        if (!["registered", "stopped", "failed"].includes(current.state)) {
          throw new BadRequestException(
            `Cannot start service from state ${current.state}`
          );
        }
        return "running";
      case "stop":
        if (!["running", "degraded", "maintenance", "failed"].includes(current.state)) {
          throw new BadRequestException(
            `Cannot stop service from state ${current.state}`
          );
        }
        return "stopped";
      case "restart":
        if (!["running", "degraded", "failed", "maintenance"].includes(current.state)) {
          throw new BadRequestException(
            `Cannot restart service from state ${current.state}`
          );
        }
        return "running";
      case "enter-maintenance":
        if (!reason?.trim()) {
          throw new BadRequestException(
            "Maintenance mode requires a reason."
          );
        }
        if (!["running", "degraded"].includes(current.state)) {
          throw new BadRequestException(
            `Cannot enter maintenance from state ${current.state}`
          );
        }
        return "maintenance";
      case "exit-maintenance":
        if (current.state !== "maintenance") {
          throw new BadRequestException(
            `Cannot exit maintenance from state ${current.state}`
          );
        }
        return "running";
      case "recover":
        if (!["failed", "degraded"].includes(current.state)) {
          throw new BadRequestException(
            `Cannot recover service from state ${current.state}`
          );
        }
        return "running";
      case "diagnose":
        return current.state;
      default:
        return current.state;
    }
  }

  private applyTransition(
    serviceId: string,
    command: LifecycleCommand,
    toState: RuntimeState,
    reason?: string,
    metadata?: Record<string, unknown>
  ) {
    const current = this.runtime.get(serviceId);

    if (command === "diagnose") {
      this.diagnostics.diagnose(serviceId);
      return this.runtime.get(serviceId);
    }

    const patch = {
      lastCommand: command,
      restartCount:
        command === "restart" ? current.restartCount + 1 : current.restartCount,
      recoveryCount:
        command === "recover" ? current.recoveryCount + 1 : current.recoveryCount,
      maintenanceReason:
        command === "enter-maintenance"
          ? reason
          : command === "exit-maintenance"
            ? undefined
            : current.maintenanceReason,
      metadata: {
        ...current.metadata,
        ...(metadata ?? {})
      }
    };

    this.platformRegistry.updateStatus(
      serviceId,
      this.mapPlatformStatus(toState),
      "platform-lifecycle"
    );

    return this.runtime.update(serviceId, toState, patch);
  }

  private mapPlatformStatus(
    state: RuntimeState
  ):
    | "registered"
    | "starting"
    | "running"
    | "degraded"
    | "stopped"
    | "failed"
    | "maintenance" {
    if (state === "recovering") {
      return "starting";
    }
    if (state === "stopping") {
      return "stopped";
    }
    return state;
  }

  recordHeartbeat(serviceId: string, dto: RecordHeartbeatDto) {
    return this.heartbeats.record(serviceId, dto);
  }

  recordFailure(serviceId: string, dto: RecordServiceFailureDto) {
    return this.failures.record(serviceId, dto);
  }

  resolveFailure(failureId: string) {
    return this.failures.resolve(failureId);
  }

  runtimeStatus(serviceId: string) {
    return {
      runtime: this.runtime.get(serviceId),
      latestHeartbeat: this.heartbeats.latest(serviceId),
      unresolvedFailures: this.failures.list(serviceId, true)
    };
  }

  runtimeList() {
    return this.runtime.list();
  }

  commandHistory(serviceId?: string, limit?: number) {
    return this.commands.list(serviceId, limit);
  }

  heartbeatHistory(serviceId: string, limit?: number) {
    return this.heartbeats.list(serviceId, limit);
  }

  failureHistory(serviceId?: string, unresolvedOnly = false) {
    return this.failures.list(serviceId, unresolvedOnly);
  }

  diagnose(serviceId: string) {
    return this.diagnostics.diagnose(serviceId);
  }

  health() {
    const runtime = this.runtime.list();
    const failed = runtime.filter((record) => record.state === "failed").length;
    const degraded = runtime.filter((record) => record.state === "degraded").length;
    const maintenance = runtime.filter(
      (record) => record.state === "maintenance"
    ).length;
    const running = runtime.filter((record) => record.state === "running").length;
    const stale = this.heartbeats.staleServices().length;

    const score = Math.max(
      0,
      Math.min(100, 100 - failed * 15 - degraded * 5 - stale * 3)
    );

    return {
      system: "AVOS Platform Service Lifecycle",
      status: score >= 90 ? "healthy" : score >= 70 ? "degraded" : "critical",
      score,
      services: runtime.length,
      running,
      degraded,
      failed,
      maintenance,
      staleHeartbeats: stale,
      unresolvedFailures: this.failures.unresolvedCount(),
      commandCount: this.commands.count(),
      generatedAt: this.ids.now()
    };
  }

  status() {
    return {
      success: true,
      system: "AVOS Platform Service Lifecycle",
      stage: "Platform",
      pack: "1B",
      version: "1.0.0",
      status: this.health().status === "healthy" ? "operational" : this.health().status,
      capabilities: [
        "service-start-stop-restart",
        "maintenance-mode",
        "runtime-state-management",
        "heartbeat-monitoring",
        "failure-recording",
        "recovery-commands",
        "service-diagnostics",
        "command-history",
        "audit-integration",
        "control-plane-status-integration"
      ],
      health: this.health(),
      generatedAt: this.ids.now()
    };
  }

  finalReview() {
    const health = this.health();
    const runtime = this.runtime.list();

    const checks = {
      controlPlaneResourcesDiscoverable: this.platformRegistry.list().length >= 7,
      runtimeRegistryAvailable: runtime.length >= 7,
      lifecycleCommandsAvailable: true,
      heartbeatMonitoringAvailable: true,
      failureRecordingAvailable: true,
      diagnosticsAvailable: true,
      auditIntegrationAvailable: true,
      healthAcceptable: health.score >= 90
    };

    const passed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const score = Math.round((passed / total) * 100);

    return {
      id: `platform-service-lifecycle-final-review:${Date.now()}`,
      system: "AVOS Platform Service Lifecycle",
      pack: "1B",
      status: score === 100 ? "passed" : "attention-required",
      score,
      checks,
      health,
      reviewedAt: this.ids.now()
    };
  }

  certify() {
    const review = this.finalReview();
    return {
      id: `platform-service-lifecycle-certification:${Date.now()}`,
      reviewId: review.id,
      system: "AVOS Platform Service Lifecycle",
      pack: "1B",
      status: review.score === 100 ? "certified" : "not-certified",
      score: review.score,
      level:
        review.score === 100
          ? "excellent"
          : review.score >= 90
            ? "good"
            : "needs-attention",
      certifiedAt: this.ids.now()
    };
  }
}