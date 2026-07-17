import { Module } from "@nestjs/common";
import { KnowledgeMarketplaceCatalogService } from "./knowledge-marketplace-catalog.service";
import { KnowledgeMarketplaceController } from "./knowledge-marketplace.controller";
import { KnowledgeMarketplaceDeliveryService } from "./knowledge-marketplace-delivery.service";
import { KnowledgeMarketplaceEventService } from "./knowledge-marketplace-event.service";
import { KnowledgeMarketplaceHealthService } from "./knowledge-marketplace-health.service";
import { KnowledgeMarketplaceLicenseService } from "./knowledge-marketplace-license.service";
import { KnowledgeMarketplaceObservabilityService } from "./knowledge-marketplace-observability.service";
import { KnowledgeMarketplaceOrderService } from "./knowledge-marketplace-order.service";
import { KnowledgeMarketplacePricingService } from "./knowledge-marketplace-pricing.service";
import { KnowledgeMarketplaceRightsService } from "./knowledge-marketplace-rights.service";

const providers = [KnowledgeMarketplaceCatalogService, KnowledgeMarketplaceLicenseService, KnowledgeMarketplacePricingService, KnowledgeMarketplaceRightsService, KnowledgeMarketplaceDeliveryService, KnowledgeMarketplaceEventService, KnowledgeMarketplaceObservabilityService, KnowledgeMarketplaceOrderService, KnowledgeMarketplaceHealthService];

@Module({ controllers: [KnowledgeMarketplaceController], providers, exports: providers })
export class KnowledgeMarketplaceModule {}