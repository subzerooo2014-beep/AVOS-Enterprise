import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ProviderExecutorService } from "./core/provider-executor.service";
import { ProviderRegistryService } from "./core/provider-registry.service";
import { SlaMonitorService } from "./monitoring/sla-monitor.service";
import { WebhookSecurityService } from "./security/webhook-security.service";
import { ProviderKind } from "./production-integrations.types";

@Controller("production-integrations")
export class ProductionIntegrationsController {
  constructor(
    private readonly registry: ProviderRegistryService,
    private readonly executor: ProviderExecutorService,
    private readonly sla: SlaMonitorService,
    private readonly webhooks: WebhookSecurityService,
  ) {}

  @Get("health")
  health() {
    return { success: true, system: "AVOS Production Integrations", status: "healthy" };
  }

  @Get("providers")
  providers() { return { success: true, providers: this.registry.list() }; }

  @Post("execute/:kind/:operation")
  execute(
    @Param("kind") kind: ProviderKind,
    @Param("operation") operation: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.executor.execute(kind, operation, payload);
  }

  @Post("webhooks/validate")
  validateWebhook(@Body() body: any) { return this.webhooks.validate(body); }

  @Get("sla")
  slaReport() { return this.sla.report(); }
}
