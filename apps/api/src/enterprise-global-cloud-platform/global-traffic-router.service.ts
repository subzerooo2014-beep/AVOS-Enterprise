import { Injectable, NotFoundException } from "@nestjs/common";
import { CloudRegionRegistryService } from "./cloud-region-registry.service";
import type { TrafficRouteRecord } from "./enterprise-global-cloud.types";

@Injectable()
export class GlobalTrafficRouterService {
  private readonly routes = new Map<string, TrafficRouteRecord>();

  constructor(private readonly regions: CloudRegionRegistryService) {}

  register(
    service: string,
    regionId: string,
    weight: number,
    enabled = true,
  ): TrafficRouteRecord {
    this.regions.get(regionId);

    const id = `${service}:${regionId}`;
    const route: TrafficRouteRecord = {
      id,
      service,
      regionId,
      weight,
      enabled,
      updatedAt: new Date().toISOString(),
    };

    this.routes.set(id, route);
    return { ...route };
  }

  resolve(service: string): TrafficRouteRecord {
    const candidates = this.list()
      .filter((route) => route.service === service && route.enabled)
      .filter((route) => this.regions.get(route.regionId).status === "ACTIVE")
      .sort((a, b) => b.weight - a.weight);

    const selected = candidates[0];

    if (!selected) {
      throw new NotFoundException(
        `No active traffic route is available for '${service}'.`,
      );
    }

    return { ...selected };
  }

  list(): TrafficRouteRecord[] {
    return Array.from(this.routes.values()).map((route) => ({ ...route }));
  }

  count(): number {
    return this.routes.size;
  }

  activeCount(): number {
    return this.list().filter((route) => route.enabled).length;
  }
}
