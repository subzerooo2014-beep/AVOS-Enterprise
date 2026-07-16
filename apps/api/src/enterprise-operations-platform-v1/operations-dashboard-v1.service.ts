import { Injectable } from "@nestjs/common";
import { OperationsDiagnosticsV1Service } from "./operations-diagnostics-v1.service";
import { OperationsHealthCenterV1Service } from "./operations-health-center-v1.service";
import { OperationsIncidentManagerV1Service } from "./operations-incident-manager-v1.service";
import { OperationsSelfHealingV1Service } from "./operations-self-healing-v1.service";
import { OperationsTelemetryV1Service } from "./operations-telemetry-v1.service";
import type { OperationsDashboardV1 } from "./enterprise-operations-platform-v1.types";

@Injectable()
export class OperationsDashboardV1Service {
  constructor(
    private readonly health: OperationsHealthCenterV1Service,
    private readonly incidents: OperationsIncidentManagerV1Service,
    private readonly healing: OperationsSelfHealingV1Service,
    private readonly telemetry: OperationsTelemetryV1Service,
    private readonly diagnostics: OperationsDiagnosticsV1Service,
  ) {}

  build(): OperationsDashboardV1 {
    const aggregate = this.health.aggregate();

    return {
      generatedAt: new Date().toISOString(),
      overallStatus: aggregate.overallStatus,
      healthScore: aggregate.healthScore,
      activeIncidents: this.incidents.openCount(),
      criticalIncidents: this.incidents.criticalCount(),
      completedHealingActions: this.healing.completedCount(),
      telemetryPoints: this.telemetry.count(),
      failedDiagnostics: this.diagnostics.failedCount(),
      serviceStatuses: this.health.list(),
    };
  }
}
