import { Module } from "@nestjs/common";
import { EnterpriseOperationsPlatformV1Controller } from "./enterprise-operations-platform-v1.controller";
import { EnterpriseOperationsPlatformV1Service } from "./enterprise-operations-platform-v1.service";
import { OperationsDashboardV1Service } from "./operations-dashboard-v1.service";
import { OperationsDiagnosticsV1Service } from "./operations-diagnostics-v1.service";
import { OperationsHealthCenterV1Service } from "./operations-health-center-v1.service";
import { OperationsIncidentManagerV1Service } from "./operations-incident-manager-v1.service";
import { OperationsSelfHealingV1Service } from "./operations-self-healing-v1.service";
import { OperationsTelemetryV1Service } from "./operations-telemetry-v1.service";

@Module({
  controllers: [EnterpriseOperationsPlatformV1Controller],
  providers: [
    EnterpriseOperationsPlatformV1Service,
    OperationsDashboardV1Service,
    OperationsDiagnosticsV1Service,
    OperationsHealthCenterV1Service,
    OperationsIncidentManagerV1Service,
    OperationsSelfHealingV1Service,
    OperationsTelemetryV1Service,
  ],
  exports: [
    EnterpriseOperationsPlatformV1Service,
    OperationsDashboardV1Service,
    OperationsDiagnosticsV1Service,
    OperationsHealthCenterV1Service,
    OperationsIncidentManagerV1Service,
    OperationsSelfHealingV1Service,
    OperationsTelemetryV1Service,
  ],
})
export class EnterpriseOperationsPlatformV1Module {}
