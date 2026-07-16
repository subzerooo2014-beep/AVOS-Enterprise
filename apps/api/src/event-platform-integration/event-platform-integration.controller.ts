import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { EventPlatformBridgeService } from "./event-platform-bridge.service";
import { EventPlatformCatalogService } from "./event-platform-catalog.service";
import { EventPlatformGovernanceService } from "./event-platform-governance.service";
import { EventPlatformIntegrationService } from "./event-platform-integration.service";
import { EventPlatformObservabilityService } from "./event-platform-observability.service";
import { EventPlatformRoutingService } from "./event-platform-routing.service";

@Controller("event-platform-integration")
export class EventPlatformIntegrationController {
  constructor(
    private readonly integration: EventPlatformIntegrationService,
    private readonly catalog: EventPlatformCatalogService,
    private readonly routing: EventPlatformRoutingService,
    private readonly bridge: EventPlatformBridgeService,
    private readonly governance: EventPlatformGovernanceService,
    private readonly observability: EventPlatformObservabilityService,
  ) {}

  @Get("status")
  status() {
    return this.integration.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.integration.diagnostics();
  }

  @Post("refresh")
  refresh() {
    const items = this.catalog.refresh();

    return {
      success: true,
      discovered: items.length,
      items,
    };
  }

  @Get("catalog")
  catalogList() {
    return {
      success: true,
      items: this.catalog.list(),
    };
  }

  @Get("catalog/type/:type")
  catalogByType(@Param("type") type: string) {
    return {
      success: true,
      type,
      items: this.catalog.findByType(type),
    };
  }

  @Get("catalog/:id")
  catalogById(@Param("id") id: string) {
    const component = this.catalog.findById(id);

    if (!component) {
      throw new NotFoundException(`Event component '${id}' was not found.`);
    }

    return {
      success: true,
      component,
    };
  }

  @Post("routes")
  registerRoute(
    @Body()
    body: {
      source: string;
      target: string;
      eventType: string;
      mode?: "DIRECT" | "BRIDGED";
    },
  ) {
    return {
      success: true,
      route: this.routing.register({
        source: body.source,
        target: body.target,
        eventType: body.eventType,
        mode: body.mode ?? "BRIDGED",
      }),
    };
  }

  @Get("routes")
  routes() {
    return {
      success: true,
      items: this.routing.list(),
    };
  }

  @Post("bridge")
  bridgeEvent(
    @Body()
    body: {
      eventType: string;
      source: string;
      payload?: Record<string, unknown>;
    },
  ) {
    return this.bridge.bridge(
      body.eventType,
      body.source,
      body.payload ?? {},
    );
  }

  @Get("governance")
  governanceStatus() {
    return {
      success: true,
      governance: this.governance.validate(),
    };
  }

  @Get("analytics")
  analytics() {
    return {
      success: true,
      analytics: this.observability.analytics(),
    };
  }
}
