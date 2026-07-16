import { Injectable } from "@nestjs/common";
import type { IntegrationRouteRecord } from "./enterprise-integration-control-plane.types";

@Injectable()
export class IntegrationRoutingService {
  private readonly routes = new Map<string, IntegrationRouteRecord>();

  register(
    input: Omit<IntegrationRouteRecord, "id"> & { id?: string },
  ): IntegrationRouteRecord {
    const route: IntegrationRouteRecord = {
      ...input,
      id:
        input.id ??
        `integration-route-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 10)}`,
    };

    this.routes.set(route.id, route);
    return { ...route };
  }

  list(): IntegrationRouteRecord[] {
    return Array.from(this.routes.values())
      .map((item) => ({ ...item }))
      .sort((a, b) => a.priority - b.priority);
  }

  resolve(operation: string): IntegrationRouteRecord[] {
    return this.list().filter(
      (item) => item.enabled && item.operation === operation,
    );
  }

  count(): number {
    return this.routes.size;
  }
}
