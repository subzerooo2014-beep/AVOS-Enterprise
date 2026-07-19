import { Injectable } from "@nestjs/common";
import { EventEnvelope, EventRoute } from "./platform-production-mega-pack-4.types";
import { EventMeshFileStoreService } from "./event-mesh-file-store.service";
import { EventContractsService } from "./event-contracts.service";
import { EventObservabilityService } from "./event-observability.service";

@Injectable()
export class EventRoutingService {
  constructor(
    private readonly store: EventMeshFileStoreService,
    private readonly contracts: EventContractsService,
    private readonly observability: EventObservabilityService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.listRoutes().length > 0) {
      return;
    }

    const defaults = [
      {
        eventType: "platform.runtime.health.updated",
        destination: "operations-dashboard",
        enabled: true,
        priority: 10,
      },
      {
        eventType: "platform.service.route.completed",
        destination: "event-observability",
        enabled: true,
        priority: 10,
      },
      {
        eventType: "platform.operations.incident.opened",
        destination: "incident-automation",
        enabled: true,
        priority: 20,
      },
    ];

    for (const route of defaults) {
      this.registerRoute(route);
    }
  }

  registerRoute(
    input: Omit<EventRoute, "id" | "createdAt">,
  ): EventRoute {
    const existing = this.listRoutes().find(
      (route) =>
        route.eventType === input.eventType &&
        route.destination === input.destination,
    );

    if (existing) {
      return existing;
    }

    const route: EventRoute = {
      ...input,
      id: this.id("event-route"),
      createdAt: this.now(),
    };

    this.store.writeJson(`routes/${route.id}.json`, route);
    return route;
  }

  listRoutes(): EventRoute[] {
    return this.store.listJson<EventRoute>("routes");
  }

  route(envelope: EventEnvelope): Array<{
    route: EventRoute;
    delivered: boolean;
  }> {
    const startedAt = Date.now();
    const validation = this.contracts.validate(envelope);

    this.observability.record({
      eventId: envelope.id,
      eventType: envelope.eventType,
      stage: "validated",
      success: validation.valid,
      durationMs: Date.now() - startedAt,
      detail:
        validation.missingFields.length > 0
          ? `Missing fields: ${validation.missingFields.join(", ")}`
          : "Contract validation passed.",
    });

    if (!validation.valid) {
      throw new Error(
        `Event contract validation failed: ${validation.missingFields.join(", ")}`,
      );
    }

    const routes = this.listRoutes()
      .filter(
        (route) =>
          route.enabled &&
          route.eventType === envelope.eventType,
      )
      .sort((a, b) => b.priority - a.priority);

    if (routes.length === 0) {
      throw new Error(`No route found for event type: ${envelope.eventType}`);
    }

    return routes.map((route) => {
      this.observability.record({
        eventId: envelope.id,
        eventType: envelope.eventType,
        destination: route.destination,
        stage: "delivered",
        success: true,
        durationMs: Date.now() - startedAt,
      });

      return {
        route,
        delivered: true,
      };
    });
  }
}