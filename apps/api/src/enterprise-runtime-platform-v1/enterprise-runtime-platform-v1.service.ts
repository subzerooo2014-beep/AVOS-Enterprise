import { Injectable } from "@nestjs/common";
import { RuntimeDiagnosticsV1Service } from "./runtime-diagnostics-v1.service";
import { RuntimeFailoverManagerV1Service } from "./runtime-failover-manager-v1.service";
import { RuntimeHealthOrchestratorV1Service } from "./runtime-health-orchestrator-v1.service";
import { RuntimeLifecycleManagerV1Service } from "./runtime-lifecycle-manager-v1.service";
import { RuntimeRecoveryCoordinatorV1Service } from "./runtime-recovery-coordinator-v1.service";
import { RuntimeServiceRegistryV1Service } from "./runtime-service-registry-v1.service";
import type {
  EnterpriseRuntimeMetricsV1,
  EnterpriseRuntimeStatusV1,
} from "./enterprise-runtime-platform-v1.types";

@Injectable()
export class EnterpriseRuntimePlatformV1Service {
  constructor(
    private readonly services: RuntimeServiceRegistryV1Service,
    private readonly lifecycle: RuntimeLifecycleManagerV1Service,
    private readonly health: RuntimeHealthOrchestratorV1Service,
    private readonly recovery: RuntimeRecoveryCoordinatorV1Service,
    private readonly failover: RuntimeFailoverManagerV1Service,
    private readonly diagnosticsService: RuntimeDiagnosticsV1Service,
  ) {}

  metrics(): EnterpriseRuntimeMetricsV1 {
    return {
      services: this.services.count(),
      readyServices: this.services.countByStatus("READY"),
      degradedServices: this.services.countByStatus("DEGRADED"),
      failedServices: this.services.countByStatus("FAILED"),
      lifecycleEvents: this.lifecycle.count(),
      recoveryPlans: this.recovery.count(),
      completedRecoveries: this.recovery.completedCount(),
      healthRecords: this.health.count(),
      unhealthyServices: this.health.unhealthyCount(),
      failovers: this.failover.count(),
      diagnostics: this.diagnosticsService.count(),
      failedDiagnostics: this.diagnosticsService.failedCount(),
    };
  }

  status(): EnterpriseRuntimeStatusV1 {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Runtime Platform V1",
      version: "1.0.0",
      status:
        metrics.failedServices > 0 ||
        metrics.unhealthyServices > 0 ||
        metrics.failedDiagnostics > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        startupOrchestrator: "READY",
        moduleLifecycleManager: "READY",
        runtimeDependencyResolver: "READY",
        healthOrchestrator: "READY",
        recoveryCoordinator: "READY",
        runtimeStateManager: "READY",
        serviceReadiness: "READY",
        gracefulShutdown: "READY",
        failoverManager: "READY",
        runtimeDiagnostics: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      status: this.status(),
      services: this.services.list(),
      lifecycleEvents: this.lifecycle.list(),
      health: this.health.aggregate(),
      recoveryPlans: this.recovery.list(),
      failovers: this.failover.list(),
      diagnostics: this.diagnosticsService.list(),
    };
  }
}
