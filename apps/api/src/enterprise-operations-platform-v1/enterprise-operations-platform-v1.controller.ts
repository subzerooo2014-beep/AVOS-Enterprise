import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseOperationsPlatformV1Service } from "./enterprise-operations-platform-v1.service";
import { OperationsDashboardV1Service } from "./operations-dashboard-v1.service";
import { OperationsDiagnosticsV1Service } from "./operations-diagnostics-v1.service";
import { OperationsHealthCenterV1Service } from "./operations-health-center-v1.service";
import { OperationsIncidentManagerV1Service } from "./operations-incident-manager-v1.service";
import { OperationsSelfHealingV1Service } from "./operations-self-healing-v1.service";
import { OperationsTelemetryV1Service } from "./operations-telemetry-v1.service";
import type {
  OperationsHealingActionV1,
  OperationsIncidentV1,
} from "./enterprise-operations-platform-v1.types";

@Controller("enterprise-operations-platform-v1")
export class EnterpriseOperationsPlatformV1Controller {
  constructor(
    private readonly platform: EnterpriseOperationsPlatformV1Service,
    private readonly health: OperationsHealthCenterV1Service,
    private readonly incidents: OperationsIncidentManagerV1Service,
    private readonly healing: OperationsSelfHealingV1Service,
    private readonly telemetry: OperationsTelemetryV1Service,
    private readonly diagnosticsService: OperationsDiagnosticsV1Service,
    private readonly dashboardService: OperationsDashboardV1Service,
  ) {}

  @Get("status")
  status() {
    return this.platform.status();
  }

  @Get("dashboard")
  dashboard() {
    return {
      success: true,
      dashboard: this.dashboardService.build(),
    };
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("health")
  reportHealth(
    @Body()
    body: {
      id: string;
      name: string;
      score: number;
      latencyMs: number;
      errorRate: number;
      details?: string[];
    },
  ) {
    return {
      success: true,
      health: this.health.report(
        body.id,
        body.name,
        body.score,
        body.latencyMs,
        body.errorRate,
        body.details,
      ),
    };
  }

  @Post("incidents")
  createIncident(
    @Body()
    body: {
      title: string;
      severity: OperationsIncidentV1["severity"];
      affectedServices: string[];
      description: string;
      owner?: string;
    },
  ) {
    return {
      success: true,
      incident: this.incidents.create(
        body.title,
        body.severity,
        body.affectedServices,
        body.description,
        body.owner,
      ),
    };
  }

  @Post("incidents/:id/status")
  transitionIncident(
    @Param("id") id: string,
    @Body() body: { status: OperationsIncidentV1["status"] },
  ) {
    return {
      success: true,
      incident: this.incidents.transition(id, body.status),
    };
  }

  @Post("healing")
  planHealing(
    @Body()
    body: {
      incidentId: string;
      serviceId: string;
      action: OperationsHealingActionV1["action"];
    },
  ) {
    return {
      success: true,
      action: this.healing.plan(
        body.incidentId,
        body.serviceId,
        body.action,
      ),
    };
  }

  @Post("healing/:id/execute")
  executeHealing(@Param("id") id: string) {
    return {
      success: true,
      action: this.healing.execute(id),
    };
  }

  @Post("telemetry")
  recordTelemetry(
    @Body()
    body: {
      source: string;
      metric: string;
      value: number;
      labels?: Record<string, string>;
    },
  ) {
    return {
      success: true,
      telemetry: this.telemetry.record(
        body.source,
        body.metric,
        body.value,
        body.labels,
      ),
    };
  }

  @Post("verify")
  verifyOperations() {
    return {
      success: true,
      diagnostic: this.diagnosticsService.run(),
    };
  }
}
