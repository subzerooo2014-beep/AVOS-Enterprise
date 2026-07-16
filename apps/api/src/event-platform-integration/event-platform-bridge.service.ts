import { Injectable } from "@nestjs/common";
import { EventPlatformObservabilityService } from "./event-platform-observability.service";
import { EventPlatformRoutingService } from "./event-platform-routing.service";

@Injectable()
export class EventPlatformBridgeService {
  constructor(
    private readonly routing: EventPlatformRoutingService,
    private readonly observability: EventPlatformObservabilityService,
  ) {}

  bridge(
    eventType: string,
    source: string,
    payload: Record<string, unknown>,
  ) {
    const routes = this.routing.resolve(eventType);

    if (routes.length === 0) {
      const observation = this.observability.record(
        eventType,
        source,
        "OBSERVED",
        undefined,
        payload,
      );

      return {
        success: true,
        mode: "OBSERVED_ONLY",
        routes: [],
        observation,
      };
    }

    const routed = routes.map((route) => {
      const observation = this.observability.record(
        eventType,
        source,
        "ROUTED",
        route.target,
        payload,
      );

      return {
        route,
        observation,
      };
    });

    return {
      success: true,
      mode: "BRIDGED",
      routes: routed,
    };
  }
}
