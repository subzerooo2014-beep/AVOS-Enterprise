import { Module } from "@nestjs/common";
import { PartnerClientService } from "./partner-client.service";
import { PartnerPlatformController } from "./partner-platform.controller";
import { PartnerRegistryService } from "./partner-registry.service";
import { PartnerWebhookService } from "./partner-webhook.service";
import { ExportProvider } from "./providers/export.provider";
import { FinanceProvider } from "./providers/finance.provider";
import { InspectionProvider } from "./providers/inspection.provider";
import { InsuranceProvider } from "./providers/insurance.provider";
import { PaymentProvider } from "./providers/payment.provider";
import { ShippingProvider } from "./providers/shipping.provider";

@Module({
  controllers: [PartnerPlatformController],
  providers: [
    PartnerRegistryService,
    PartnerClientService,
    PartnerWebhookService,
    FinanceProvider,
    InsuranceProvider,
    InspectionProvider,
    PaymentProvider,
    ShippingProvider,
    ExportProvider,
  ],
  exports: [
    PartnerRegistryService,
    PartnerClientService,
    PartnerWebhookService,
    FinanceProvider,
    InsuranceProvider,
    InspectionProvider,
    PaymentProvider,
    ShippingProvider,
    ExportProvider,
  ],
})
export class PartnerPlatformModule {}
