import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ConfigurationCenterService } from "./configuration-center.service";
import { EnterprisePlatformServicesControlPlaneService } from "./enterprise-platform-services-control-plane.service";
import { FeatureFlagService } from "./feature-flag.service";
import { NotificationOrchestratorService } from "./notification-orchestrator.service";
import { PlatformServicesCatalogService } from "./platform-services-catalog.service";
import { SchedulerControlService } from "./scheduler-control.service";
import { TenantContextService } from "./tenant-context.service";
import type {
  ConfigurationRecord,
  FeatureFlagRecord,
  NotificationRecord,
  ScheduledTaskRecord,
  TenantContextRecord,
} from "./enterprise-platform-services-control-plane.types";

@Controller("enterprise-platform-services-control-plane")
export class EnterprisePlatformServicesControlPlaneController {
  constructor(
    private readonly controlPlane: EnterprisePlatformServicesControlPlaneService,
    private readonly catalog: PlatformServicesCatalogService,
    private readonly notifications: NotificationOrchestratorService,
    private readonly scheduler: SchedulerControlService,
    private readonly flags: FeatureFlagService,
    private readonly configuration: ConfigurationCenterService,
    private readonly tenants: TenantContextService,
  ) {}

  @Get("status")
  status() {
    return this.controlPlane.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.controlPlane.diagnostics();
  }

  @Post("catalog/refresh")
  refreshCatalog() {
    const items = this.catalog.refresh();
    return { success: true, discovered: items.length, items };
  }

  @Post("notifications")
  queueNotification(
    @Body()
    body: Omit<NotificationRecord, "id" | "status" | "createdAt">,
  ) {
    return {
      success: true,
      notification: this.notifications.queue(body),
    };
  }

  @Post("notifications/:id/sent")
  markNotificationSent(@Param("id") id: string) {
    return {
      success: true,
      notification: this.notifications.markSent(id),
    };
  }

  @Post("schedules")
  registerSchedule(@Body() body: ScheduledTaskRecord) {
    return { success: true, schedule: this.scheduler.register(body) };
  }

  @Post("feature-flags")
  setFeatureFlag(
    @Body() body: Omit<FeatureFlagRecord, "version" | "updatedAt">,
  ) {
    return { success: true, featureFlag: this.flags.set(body) };
  }

  @Post("configuration")
  setConfiguration(
    @Body() body: Omit<ConfigurationRecord, "version" | "updatedAt">,
  ) {
    return {
      success: true,
      configuration: this.configuration.set(body),
    };
  }

  @Post("tenants")
  registerTenant(@Body() body: TenantContextRecord) {
    return { success: true, tenant: this.tenants.register(body) };
  }

  @Get("tenants")
  tenantList() {
    return { success: true, items: this.tenants.list() };
  }
}
