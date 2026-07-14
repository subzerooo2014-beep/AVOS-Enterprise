import { Injectable } from "@nestjs/common";
import { EnterpriseCacheService } from "./enterprise-cache.service";
import { EnterpriseCommandBusService } from "./enterprise-command-bus.service";
import { EnterpriseEventMeshService } from "./enterprise-event-mesh.service";
import { EnterpriseSchedulerService } from "./enterprise-scheduler.service";
import { EnterpriseServiceDiscoveryService } from "./enterprise-service-discovery.service";
import { EnterpriseRuntimeSnapshot } from "./enterprise-e5.types";

@Injectable()
export class EnterpriseRuntimeAnalyticsService {
  constructor(
    private readonly commands: EnterpriseCommandBusService,
    private readonly events: EnterpriseEventMeshService,
    private readonly scheduler: EnterpriseSchedulerService,
    private readonly cache: EnterpriseCacheService,
    private readonly discovery: EnterpriseServiceDiscoveryService,
  ) {}

  snapshot(): EnterpriseRuntimeSnapshot {
    return {
      commands: this.commands.count(),
      events: this.events.count(),
      jobs: this.scheduler.count(),
      cacheEntries: this.cache.count(),
      discoveredServices: this.discovery.count(),
      healthyServices: this.discovery.healthyCount(),
      generatedAt: new Date().toISOString(),
    };
  }
}