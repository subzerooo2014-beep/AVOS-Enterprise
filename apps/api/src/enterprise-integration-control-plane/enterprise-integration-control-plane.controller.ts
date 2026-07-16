import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnterpriseIntegrationControlPlaneService } from "./enterprise-integration-control-plane.service";
import { IntegrationCatalogService } from "./integration-catalog.service";
import { IntegrationProviderRegistryService } from "./integration-provider-registry.service";
import { IntegrationRoutingService } from "./integration-routing.service";
import { WebhookOrchestratorService } from "./webhook-orchestrator.service";
import type { IntegrationRouteRecord } from "./enterprise-integration-control-plane.types";

@Controller("enterprise-integration-control-plane")
export class EnterpriseIntegrationControlPlaneController {
  constructor(
    private readonly controlPlane: EnterpriseIntegrationControlPlaneService,
    private readonly catalog: IntegrationCatalogService,
    private readonly providers: IntegrationProviderRegistryService,
    private readonly routing: IntegrationRoutingService,
    private readonly webhooks: WebhookOrchestratorService,
  ) {}

  @Get("status")
  status() {
    return this.controlPlane.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.controlPlane.diagnostics();
  }

  @Post("refresh")
  refresh() {
    return this.controlPlane.refresh();
  }

  @Get("catalog")
  catalogList() {
    return { success: true, items: this.catalog.list() };
  }

  @Get("providers")
  providerList() {
    return { success: true, items: this.providers.list() };
  }

  @Post("routes")
  registerRoute(
    @Body() body: Omit<IntegrationRouteRecord, "id"> & { id?: string },
  ) {
    return { success: true, route: this.routing.register(body) };
  }

  @Get("routes")
  routeList() {
    return { success: true, items: this.routing.list() };
  }

  @Post("webhooks/dispatch")
  dispatchWebhook(
    @Body()
    body: {
      operation: string;
      payload?: Record<string, unknown>;
    },
  ) {
    return this.webhooks.dispatch(body.operation, body.payload ?? {});
  }
}
