import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { KnowledgeMarketplaceCatalogService } from "./knowledge-marketplace-catalog.service";
import { KnowledgeMarketplaceHealthService } from "./knowledge-marketplace-health.service";
import { KnowledgeMarketplaceOrderService } from "./knowledge-marketplace-order.service";
import { KnowledgeMarketplaceListing, KnowledgeMarketplaceSearchQuery } from "./knowledge-marketplace.types";

@Controller("knowledge-fabric/marketplace")
export class KnowledgeMarketplaceController {
  constructor(private readonly catalog: KnowledgeMarketplaceCatalogService, private readonly orders: KnowledgeMarketplaceOrderService, private readonly health: KnowledgeMarketplaceHealthService) {}

  @Get("status") status() { return this.health.status(); }
  @Get("listings") listings(@Query() query: KnowledgeMarketplaceSearchQuery) { return this.catalog.search(query); }
  @Post("listings") createListing(@Body() body: Omit<KnowledgeMarketplaceListing, "id" | "state" | "createdAt" | "updatedAt">) { return this.catalog.createListing(body); }
  @Post("listings/:id/publish") publish(@Param("id") id: string) { return this.catalog.publishListing(id); }
  @Get("orders") ordersList() { return this.orders.listOrders(); }
  @Post("orders") createOrder(@Body() body: { listingId: string; buyerId: string; quantity?: number }) { return this.orders.createOrder(body.listingId, body.buyerId, body.quantity); }
  @Post("orders/:id/fulfill") fulfill(@Param("id") id: string) { return this.orders.fulfillOrder(id); }
}