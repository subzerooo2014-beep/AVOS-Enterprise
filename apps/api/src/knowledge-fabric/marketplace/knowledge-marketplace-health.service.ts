import { Injectable } from "@nestjs/common";
import { KnowledgeMarketplaceCatalogService } from "./knowledge-marketplace-catalog.service";
import { KnowledgeMarketplaceOrderService } from "./knowledge-marketplace-order.service";
import { KnowledgeMarketplaceObservabilityService } from "./knowledge-marketplace-observability.service";

@Injectable()
export class KnowledgeMarketplaceHealthService {
  constructor(
    private readonly catalog: KnowledgeMarketplaceCatalogService,
    private readonly orders: KnowledgeMarketplaceOrderService,
    private readonly observability: KnowledgeMarketplaceObservabilityService,
  ) {}
  status() {
    return { success: true, system: "AVOS Knowledge Fabric", pack: "KF-10 Knowledge Marketplace", status: "operational", listings: this.catalog.listListings().length, orders: this.orders.listOrders().length, metrics: this.observability.snapshot(), nextPack: "KF-11 Knowledge Economy" };
  }
}