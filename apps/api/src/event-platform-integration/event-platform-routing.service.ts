import { Injectable } from "@nestjs/common";
import type { EventPlatformRoute } from "./event-platform-integration.types";

@Injectable()
export class EventPlatformRoutingService {
  private readonly routes = new Map<string, EventPlatformRoute>();

  register(route: EventPlatformRoute): EventPlatformRoute {
    const key = `${route.source}:${route.target}:${route.eventType}`;
    this.routes.set(key, { ...route });
    return { ...route };
  }

  list(): EventPlatformRoute[] {
    return Array.from(this.routes.values()).map((route) => ({ ...route }));
  }

  resolve(eventType: string): EventPlatformRoute[] {
    return this.list().filter(
      (route) => route.eventType === eventType || route.eventType === "*",
    );
  }

  count(): number {
    return this.routes.size;
  }
}
