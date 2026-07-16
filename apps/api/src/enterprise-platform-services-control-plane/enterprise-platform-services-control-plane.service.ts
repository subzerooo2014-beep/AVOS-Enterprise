import { Injectable } from "@nestjs/common";
import { ConfigurationCenterService } from "./configuration-center.service";
import { FeatureFlagService } from "./feature-flag.service";
import { NotificationOrchestratorService } from "./notification-orchestrator.service";
import { PlatformServicesCatalogService } from "./platform-services-catalog.service";
import { PlatformServicesGovernanceService } from "./platform-services-governance.service";
import { PlatformServicesObservabilityService } from "./platform-services-observability.service";
import { SchedulerControlService } from "./scheduler-control.service";
import { TenantContextService } from "./tenant-context.service";
import type {
  PlatformServicesHealth,
  PlatformServicesMetrics,
} from "./enterprise-platform-services-control-plane.types";

@Injectable()
export class EnterprisePlatformServicesControlPlaneService {
  constructor(
    private readonly catalog: PlatformServicesCatalogService,
    private readonly notifications: NotificationOrchestratorService,
    private readonly scheduler: SchedulerControlService,
    private readonly flags: FeatureFlagService,
    private readonly configuration: ConfigurationCenterService,
    private readonly tenants: TenantContextService,
    private readonly observability: PlatformServicesObservabilityService,
    private readonly governance: PlatformServicesGovernanceService,
  ) {}

  metrics(): PlatformServicesMetrics {
    const analytics = this.observability.analytics();

    return {
      components: this.catalog.count(),
      notifications: analytics.notifications,
      sentNotifications: analytics.sentNotifications,
      failedNotifications: analytics.failedNotifications,
      scheduledTasks: analytics.scheduledTasks,
      featureFlags: this.flags.count(),
      configurations: this.configuration.count(),
      tenants: this.tenants.count(),
    };
  }

  health(): PlatformServicesHealth {
    const governance = this.governance.validate();

    return {
      success: true,
      system: "AVOS Enterprise Platform Services Control Plane",
      version: "1.0.0",
      status: governance.compliant ? "READY" : "DEGRADED",
      metrics: this.metrics(),
      components: {
        discovery: "READY",
        catalog: "READY",
        notificationOrchestration: "READY",
        schedulerControl: "READY",
        searchIntegration: "INTEGRATION_READY",
        reportingIntegration: "INTEGRATION_READY",
        filesIntegration: "INTEGRATION_READY",
        mediaIntegration: "INTEGRATION_READY",
        configurationCenter: "READY",
        featureFlags: "READY",
        tenantContext: "READY",
        observability: "READY",
        governance: governance.compliant ? "READY" : "DEGRADED",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      catalog: this.catalog.status(),
      notifications: this.notifications.list(),
      scheduledTasks: this.scheduler.list(),
      featureFlags: this.flags.list(),
      configurations: this.configuration.list(),
      tenants: this.tenants.list(),
      analytics: this.observability.analytics(),
      governance: this.governance.validate(),
    };
  }
}
