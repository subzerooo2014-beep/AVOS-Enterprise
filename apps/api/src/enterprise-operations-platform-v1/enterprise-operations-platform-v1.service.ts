import { Injectable } from "@nestjs/common";
import { OperationsDashboardV1Service } from "./operations-dashboard-v1.service";
import { OperationsDiagnosticsV1Service } from "./operations-diagnostics-v1.service";
import { OperationsHealthCenterV1Service } from "./operations-health-center-v1.service";
import { OperationsIncidentManagerV1Service } from "./operations-incident-manager-v1.service";
import { OperationsSelfHealingV1Service } from "./operations-self-healing-v1.service";
import { OperationsTelemetryV1Service } from "./operations-telemetry-v1.service";
import type {
  OperationsMetricsV1,
  OperationsPlatformStatusV1,
} from "./enterprise-operations-platform-v1.types";

@Injectable()
export class EnterpriseOperationsPlatformV1Service {
  constructor(
    private readonly health: OperationsHealthCenterV1Service,
    private readonly incidents: OperationsIncidentManagerV1Service,
    private readonly healing: OperationsSelfHealingV1Service,
    private readonly telemetry: OperationsTelemetryV1Service,
    private readonly diagnosticsService: OperationsDiagnosticsV1Service,
    private readonly dashboardService: OperationsDashboardV1Service,
  ) {}

  metrics(): OperationsMetricsV1 {
    return {
      services: this.health.count(),
      healthyServices: this.health.healthyCount(),
      degradedServices: this.health.degradedCount(),
      unhealthyServices: this.health.unhealthyCount(),
      incidents: this.incidents.count(),
      openIncidents: this.incidents.openCount(),
      criticalIncidents: this.incidents.criticalCount(),
      healingActions: this.healing.count(),
      completedHealingActions: this.healing.completedCount(),
      telemetryPoints: this.telemetry.count(),
      diagnostics: this.diagnosticsService.count(),
      failedDiagnostics: this.diagnosticsService.failedCount(),
    };
  }

  status(): OperationsPlatformStatusV1 {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Operations Platform V1",
      version: "1.0.0",
      status:
        metrics.unhealthyServices > 0 ||
        metrics.criticalIncidents > 0 ||
        metrics.failedDiagnostics > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        unifiedOperationsDashboard: "READY",
        livePlatformHealth: "READY",
        operationsCommandCenter: "READY",
        unifiedMonitoring: "READY",
        platformDiagnostics: "READY",
        selfHealingOrchestrator: "READY",
        incidentManagement: "READY",
        runtimeTelemetryAggregator: "READY",
        operationsAnalytics: "READY",
        operationsVerification: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      status: this.status(),
      dashboard: this.dashboardService.build(),
      incidents: this.incidents.list(),
      healingActions: this.healing.list(),
      telemetry: this.telemetry.list(),
      diagnostics: this.diagnosticsService.list(),
    };
  }
}
