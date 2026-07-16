import { Module } from "@nestjs/common";
import { AlertManagerService } from "./alert-manager.service";
import { DistributedTracingService } from "./distributed-tracing.service";
import { EnterpriseReliabilityObservabilityController } from "./enterprise-reliability-observability.controller";
import { IncidentManagerService } from "./incident-manager.service";
import { MetricsRegistryService } from "./metrics-registry.service";
import { MonitoringDashboardService } from "./monitoring-dashboard.service";
import { ServiceHealthRegistryService } from "./service-health-registry.service";
import { StructuredLoggingService } from "./structured-logging.service";

@Module({
  controllers: [EnterpriseReliabilityObservabilityController],
  providers: [
    AlertManagerService,
    DistributedTracingService,
    IncidentManagerService,
    MetricsRegistryService,
    MonitoringDashboardService,
    ServiceHealthRegistryService,
    StructuredLoggingService,
  ],
  exports: [
    AlertManagerService,
    DistributedTracingService,
    IncidentManagerService,
    MetricsRegistryService,
    MonitoringDashboardService,
    ServiceHealthRegistryService,
    StructuredLoggingService,
  ],
})
export class EnterpriseReliabilityObservabilityModule {}
