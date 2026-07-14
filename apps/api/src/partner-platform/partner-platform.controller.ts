import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ExportProvider } from "./providers/export.provider";
import { FinanceProvider } from "./providers/finance.provider";
import { InspectionProvider } from "./providers/inspection.provider";
import { InsuranceProvider } from "./providers/insurance.provider";
import { PaymentProvider } from "./providers/payment.provider";
import { ShippingProvider } from "./providers/shipping.provider";
import { PartnerRegistryService } from "./partner-registry.service";
import { PartnerWebhookService } from "./partner-webhook.service";
import { PartnerEnvironment } from "./partner-platform.types";

@Controller("partner-platform")
export class PartnerPlatformController {
  constructor(
    private readonly registry: PartnerRegistryService,
    private readonly webhooks: PartnerWebhookService,
    private readonly finance: FinanceProvider,
    private readonly insurance: InsuranceProvider,
    private readonly inspection: InspectionProvider,
    private readonly payment: PaymentProvider,
    private readonly shipping: ShippingProvider,
    private readonly exportProvider: ExportProvider,
  ) {}

  @Get("health")
  health() {
    return {
      success: true,
      system: "AVOS Partner Integration Platform",
      status: "healthy",
    };
  }

  @Get("partners")
  partners() {
    return { success: true, partners: this.registry.list() };
  }

  @Patch("partners/:code/environment")
  switchEnvironment(
    @Param("code") code: string,
    @Body() body: { environment: PartnerEnvironment },
  ) {
    return {
      success: true,
      partner: this.registry.switchEnvironment(code, body.environment),
    };
  }

  @Patch("partners/:code/credentials")
  updateCredentials(
    @Param("code") code: string,
    @Body()
    body: {
      clientId?: string;
      secret?: string;
      tokenUrl?: string;
      webhookSecret?: string;
    },
  ) {
    return {
      success: true,
      partner: this.registry.updateCredentials(code, body),
    };
  }

  @Post("finance/applications")
  financeRequest(@Body() body: Record<string, unknown>) {
    return this.finance.submit(body);
  }

  @Post("insurance/quotes")
  insuranceRequest(@Body() body: Record<string, unknown>) {
    return this.insurance.submit(body);
  }

  @Post("inspection/bookings")
  inspectionRequest(@Body() body: Record<string, unknown>) {
    return this.inspection.submit(body);
  }

  @Post("payments")
  paymentRequest(@Body() body: Record<string, unknown>) {
    return this.payment.submit(body);
  }

  @Post("shipping/requests")
  shippingRequest(@Body() body: Record<string, unknown>) {
    return this.shipping.submit(body);
  }

  @Post("export/cases")
  exportRequest(@Body() body: Record<string, unknown>) {
    return this.exportProvider.submit(body);
  }

  @Post("webhooks/:partnerCode")
  webhook(
    @Param("partnerCode") partnerCode: string,
    @Body()
    body: {
      eventType: string;
      payload: Record<string, unknown>;
      signature?: string;
      eventId?: string;
    },
  ) {
    return {
      success: true,
      event: this.webhooks.receive({ partnerCode, ...body }),
    };
  }

  @Get("webhooks")
  webhookList() {
    return { success: true, events: this.webhooks.list() };
  }
}
