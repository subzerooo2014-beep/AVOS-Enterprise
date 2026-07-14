import { Body, Controller, Get, Headers, Param, Patch, Post } from "@nestjs/common";
import { SuperAppV4PartnerGatewayService } from "./super-app-v4.partner-gateway.service";
import { SuperAppV4WebhookService } from "./super-app-v4.webhook.service";
import { SuperAppV4WorkflowService } from "./super-app-v4.workflow.service";
import {
  IntegrationStatus,
  PartnerType,
} from "./super-app-v4.types";

@Controller("super-app-v4")
export class SuperAppV4Controller {
  constructor(
    private readonly gateway: SuperAppV4PartnerGatewayService,
    private readonly webhooks: SuperAppV4WebhookService,
    private readonly workflow: SuperAppV4WorkflowService,
  ) {}

  @Get("health")
  health() {
    return {
      success: true,
      system: "AVOS Super App Phase 4",
      status: "healthy",
      capabilities: [
        "partner_gateway",
        "finance_integration",
        "insurance_integration",
        "inspection_integration",
        "payment_integration",
        "shipping_integration",
        "export_integration",
        "webhooks",
        "retry_handling",
        "failure_handling",
        "integration_dashboard",
      ],
    };
  }

  @Get("partners")
  partners() {
    return {
      success: true,
      partners: this.gateway.listPartners(),
    };
  }

  @Post("integrations")
  createIntegration(
    @Body()
    body: {
      dealId: string;
      partnerType: PartnerType;
      payload: Record<string, unknown>;
      callbackUrl?: string;
    },
  ) {
    return {
      success: true,
      request: this.gateway.createRequest(body),
    };
  }

  @Post("integrations/:id/submit")
  submit(@Param("id") id: string) {
    return {
      success: true,
      request: this.gateway.submit(id),
    };
  }

  @Post("integrations/:id/retry")
  retry(@Param("id") id: string) {
    return {
      success: true,
      request: this.gateway.retry(id),
    };
  }

  @Patch("integrations/:id/status")
  updateStatus(
    @Param("id") id: string,
    @Body()
    body: {
      status: IntegrationStatus;
      response?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      request: this.gateway.updateStatus(id, body.status, body.response),
    };
  }

  @Get("integrations")
  integrations() {
    return {
      success: true,
      requests: this.gateway.listRequests(),
    };
  }

  @Post("workflow/start")
  startWorkflow(
    @Body()
    body: {
      dealId: string;
      financingRequired: boolean;
      insuranceRequired: boolean;
      inspectionRequired: boolean;
      paymentRequired: boolean;
      shippingRequired?: boolean;
      exportRequired?: boolean;
    },
  ) {
    return {
      success: true,
      workflow: this.workflow.startDealIntegrations(body),
    };
  }

  @Post("webhooks/:partnerId")
  webhook(
    @Param("partnerId") partnerId: string,
    @Headers("x-avos-signature") signature: string | undefined,
    @Body()
    body: {
      requestId: string;
      eventType: string;
      payload: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      event: this.webhooks.receive({
        partnerId,
        signature,
        ...body,
      }),
    };
  }

  @Get("webhooks")
  webhookEvents() {
    return {
      success: true,
      events: this.webhooks.list(),
    };
  }

  @Get("operations/dashboard")
  dashboard() {
    return {
      success: true,
      dashboard: this.gateway.dashboard(),
    };
  }
}
