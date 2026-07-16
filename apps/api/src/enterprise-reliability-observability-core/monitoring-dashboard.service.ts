import { Injectable } from "@nestjs/common";
import { AlertManagerService } from "./alert-manager.service";
import { DistributedTracingService } from "./distributed-tracing.service";
import { IncidentManagerService } from "./incident-manager.service";
import { MetricsRegistryService } from "./metrics-registry.service";
import { ServiceHealthRegistryService } from "./service-health-registry.service";
import { StructuredLoggingService } from "./structured-logging.service";
import type {
  ReliabilityObservabilityHealth,
  ReliabilityObservabilityMetrics,
} from "./reliability-observability.types";

@Injectable()
export class MonitoringDashboardService {
  constructor(
    private readonly healthRegistry: ServiceHealthRegistryService,
    private readonly metricsRegistry: MetricsRegistryService,
    private readonly logging: StructuredLoggingService,
    private readonly tracing: DistributedTracingService,
    private readonly alerts: AlertManagerService,
    private readonly incidents: IncidentManagerService,
  ) {}

  metrics(): ReliabilityObservabilityMetrics {
    const services = this.healthRegistry.list();

    return {
      services: services.length,
      healthyServices: services.filter((item) => item.state === "HEALTHY")
        .length,
      degradedServices: services.filter((item) => item.state === "DEGRADED")
        .length,
      unhealthyServices: services.filter((item) => item.state === "UNHEALTHY")
        .length,
      metrics: this.metricsRegistry.count(),
      logs: this.logging.count(),
      traces: this.tracing.count(),
      openAlerts: this.alerts.openCount(),
      incidents: this.incidents.count(),
      openIncidents: this.incidents.openCount(),
    };
  }

  health(): ReliabilityObservabilityHealth {
    const metrics = this.metrics();
    const degraded =
      metrics.unhealthyServices > 0 ||
      metrics.openIncidents > 0 ||
      metrics.openAlerts > 0;

    return {
      success: true,
      system: "AVOS Enterprise Reliability & Observability Core",
      version: "1.0.0",
      status: degraded ? "DEGRADED" : "READY",
      metrics,
      components: {
        serviceHealthRegistry: "READY",
        healthDashboard: "READY",
        metricsRegistry: "READY",
        metricsAggregator: "READY",
        structuredLogging: "READY",
        logCorrelation: "READY",
        distributedTracing: "READY",
        traceContext: "READY",
        alertManager: "READY",
        alertRules: "READY",
        incidentManager: "READY",
        incidentTimeline: "READY",
        monitoringDashboard: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      services: this.healthRegistry.list(),
      metrics: this.metricsRegistry.list(),
      logs: this.logging.list(),
      traces: this.tracing.list(),
      alertRules: this.alerts.rulesList(),
      alerts: this.alerts.alertsList(),
      incidents: this.incidents.list(),
    };
  }
}
