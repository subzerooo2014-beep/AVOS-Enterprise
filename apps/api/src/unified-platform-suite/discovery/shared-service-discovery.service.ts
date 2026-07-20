import { Injectable } from "@nestjs/common";
import { UnifiedPlatformRegistryService } from "../registry/unified-platform-registry.service";

@Injectable()
export class SharedServiceDiscoveryService {
  constructor(private readonly registry: UnifiedPlatformRegistryService) {}

  discover(capability?: string) {
    const services = this.registry.list().filter((component) =>
      !capability || component.capabilities.includes(capability)
    );
    return {
      capability: capability ?? null,
      matches: services,
      discoveredAt: new Date().toISOString()
    };
  }

  healthDiscovery() {
    const services = this.registry.list();
    return {
      total: services.length,
      healthy: services.filter((service) => service.status === "operational").length,
      degraded: services.filter((service) => service.status === "degraded").length,
      offline: services.filter((service) => service.status === "offline").length
    };
  }
}