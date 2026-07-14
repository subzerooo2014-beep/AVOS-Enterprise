import { Injectable } from "@nestjs/common";
import { GovernmentProviderRegistryService } from "./government-provider-registry.service";
import { GovernmentAuditService } from "./government-audit.service";
import { GovernmentWebhookService } from "./government-webhook.service";
@Injectable()
export class GovernmentDashboardService {
  constructor(
    private readonly registry: GovernmentProviderRegistryService,
    private readonly audit: GovernmentAuditService,
    private readonly webhooks: GovernmentWebhookService,
  ) {}
  summary() {
    return {
      providers: this.registry.list().length,
      auditRecords: this.audit.list().length,
      webhooks: this.webhooks.list().length,
      environment: "SANDBOX",
    };
  }
}
