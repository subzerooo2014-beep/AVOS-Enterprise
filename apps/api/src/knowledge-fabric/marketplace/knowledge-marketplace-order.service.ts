import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeMarketplaceCatalogService } from "./knowledge-marketplace-catalog.service";
import { KnowledgeMarketplaceDeliveryService } from "./knowledge-marketplace-delivery.service";
import { KnowledgeMarketplaceEventService } from "./knowledge-marketplace-event.service";
import { KnowledgeMarketplaceLicenseService } from "./knowledge-marketplace-license.service";
import { KnowledgeMarketplaceObservabilityService } from "./knowledge-marketplace-observability.service";
import { KnowledgeMarketplacePricingService } from "./knowledge-marketplace-pricing.service";
import { KnowledgeMarketplaceDelivery, KnowledgeMarketplaceLicense, KnowledgeMarketplaceOrder } from "./knowledge-marketplace.types";

@Injectable()
export class KnowledgeMarketplaceOrderService {
  private readonly orders = new Map<string, KnowledgeMarketplaceOrder>();
  constructor(
    private readonly catalog: KnowledgeMarketplaceCatalogService,
    private readonly pricing: KnowledgeMarketplacePricingService,
    private readonly licenses: KnowledgeMarketplaceLicenseService,
    private readonly delivery: KnowledgeMarketplaceDeliveryService,
    private readonly events: KnowledgeMarketplaceEventService,
    private readonly observability: KnowledgeMarketplaceObservabilityService,
  ) {}

  createOrder(listingId: string, buyerId: string, quantity = 1): KnowledgeMarketplaceOrder {
    const listing = this.catalog.getListing(listingId);
    if (listing.state !== "PUBLISHED") throw new BadRequestException("Only published listings can be ordered.");
    const now = new Date().toISOString();
    const order: KnowledgeMarketplaceOrder = {
      id: randomUUID(), listingId, buyerId, quantity: Math.max(1, quantity),
      amount: this.pricing.calculate(listing, quantity), currency: listing.currency,
      state: "CREATED", createdAt: now, updatedAt: now,
    };
    this.orders.set(order.id, order);
    this.events.emit("knowledge.marketplace.order.created", order.id, { listingId, buyerId });
    this.observability.increment("orders.created");
    return structuredClone(order);
  }

  fulfillOrder(orderId: string): { order: KnowledgeMarketplaceOrder; license: KnowledgeMarketplaceLicense; delivery: KnowledgeMarketplaceDelivery } {
    const order = this.orders.get(orderId);
    if (!order) throw new NotFoundException(`Marketplace order ${orderId} was not found.`);
    if (order.state !== "CREATED" && order.state !== "APPROVED") throw new BadRequestException("Order cannot be fulfilled in its current state.");
    const listing = this.catalog.getListing(order.listingId);
    const license = this.licenses.issue(listing, order.buyerId);
    const delivery = this.delivery.deliver(order, listing);
    order.state = "FULFILLED";
    order.licenseId = license.id;
    order.updatedAt = new Date().toISOString();
    this.events.emit("knowledge.marketplace.order.fulfilled", order.id, { licenseId: license.id, deliveryId: delivery.id });
    this.observability.increment("orders.fulfilled");
    return { order: structuredClone(order), license, delivery };
  }

  listOrders(): KnowledgeMarketplaceOrder[] { return [...this.orders.values()].map((item) => structuredClone(item)); }
}