import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AlertManagerService } from "./alert-manager.service";
import { DistributedTracingService } from "./distributed-tracing.service";
import { IncidentManagerService } from "./incident-manager.service";
import { MetricsRegistryService } from "./metrics-registry.service";
import { MonitoringDashboardService } from "./monitoring-dashboard.service";
import { ServiceHealthRegistryService } from "./service-health-registry.service";
import { StructuredLoggingService } from "./structured-logging.service";
import type {
  AlertRuleRecord,
  IncidentRecord,
  ServiceHealthRecord,
  StructuredLogRecord,
} from "./reliability-observability.types";

@Controller("enterprise-reliability-observability")
export class EnterpriseReliabilityObservabilityController {
  constructor(
    private readonly dashboard: MonitoringDashboardService,
    private readonly healthRegistry: ServiceHealthRegistryService,
    private readonly metrics: MetricsRegistryService,
    private readonly logging: StructuredLoggingService,
    private readonly tracing: DistributedTracingService,
    private readonly alerts: AlertManagerService,
    private readonly incidents: IncidentManagerService,
  ) {}

  @Get("status")
  status() {
    return this.dashboard.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.dashboard.diagnostics();
  }

  @Post("health")
  reportHealth(
    @Body() body: Omit<ServiceHealthRecord, "id" | "checkedAt">,
  ) {
    return {
      success: true,
      health: this.healthRegistry.report(body),
    };
  }

  @Post("metrics")
  recordMetric(
    @Body()
    body: {
      name: string;
      value: number;
      unit?: string;
      labels?: Record<string, string>;
    },
  ) {
    const metric = this.metrics.record(
      body.name,
      body.value,
      body.unit,
      body.labels,
    );
    const alerts = this.alerts.evaluate(body.name, body.value);

    return {
      success: true,
      metric,
      alerts,
    };
  }

  @Get("metrics/aggregate")
  aggregateMetric(@Query("name") name: string) {
    return {
      success: true,
      aggregate: this.metrics.aggregate(name),
    };
  }

  @Post("logs")
  writeLog(
    @Body()
    body: {
      level: StructuredLogRecord["level"];
      message: string;
      service: string;
      metadata?: Record<string, unknown>;
      correlationId?: string;
      traceId?: string;
    },
  ) {
    return {
      success: true,
      log: this.logging.write(
        body.level,
        body.message,
        body.service,
        body.metadata,
        body.correlationId,
        body.traceId,
      ),
    };
  }

  @Post("traces/start")
  startTrace(
    @Body()
    body: {
      service: string;
      operation: string;
      traceId?: string;
      parentSpanId?: string;
      metadata?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      span: this.tracing.start(
        body.service,
        body.operation,
        body.traceId,
        body.parentSpanId,
        body.metadata,
      ),
    };
  }

  @Post("traces/:id/complete")
  completeTrace(
    @Param("id") id: string,
    @Body() body: { failed?: boolean },
  ) {
    return {
      success: true,
      span: this.tracing.complete(id, body.failed ?? false),
    };
  }

  @Post("alert-rules")
  registerAlertRule(@Body() body: AlertRuleRecord) {
    return {
      success: true,
      rule: this.alerts.registerRule(body),
    };
  }

  @Post("alerts/:id/resolve")
  resolveAlert(@Param("id") id: string) {
    return {
      success: true,
      alert: this.alerts.resolve(id),
    };
  }

  @Post("incidents")
  createIncident(
    @Body()
    body: Omit<IncidentRecord, "id" | "status" | "timeline" | "createdAt">,
  ) {
    return {
      success: true,
      incident: this.incidents.create(body),
    };
  }

  @Post("incidents/:id/timeline")
  addIncidentTimeline(
    @Param("id") id: string,
    @Body() body: { message: string },
  ) {
    return {
      success: true,
      incident: this.incidents.addTimeline(id, body.message),
    };
  }

  @Post("incidents/:id/resolve")
  resolveIncident(@Param("id") id: string) {
    return {
      success: true,
      incident: this.incidents.resolve(id),
    };
  }
}
