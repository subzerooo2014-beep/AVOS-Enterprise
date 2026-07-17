import { Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import { KnowledgeMarketplaceDelivery, KnowledgeMarketplaceListing, KnowledgeMarketplaceOrder } from "./knowledge-marketplace.types";

@Injectable()
export class KnowledgeMarketplaceDeliveryService {
  private readonly deliveries = new Map<string, KnowledgeMarketplaceDelivery>();

  deliver(order: KnowledgeMarketplaceOrder, listing: KnowledgeMarketplaceListing): KnowledgeMarketplaceDelivery {
    const deliveredAt = new Date().toISOString();
    const checksum = createHash("sha256").update(`${listing.knowledgeId}:${listing.version}:${order.id}`).digest("hex");
    const delivery: KnowledgeMarketplaceDelivery = {
      id: randomUUID(), orderId: order.id, knowledgeId: listing.knowledgeId, version: listing.version,
      checksum, deliveredAt, receipt: `kmr_${order.id}_${checksum.slice(0, 12)}`,
    };
    this.deliveries.set(delivery.id, delivery);
    return structuredClone(delivery);
  }

  list(): KnowledgeMarketplaceDelivery[] { return [...this.deliveries.values()].map((item) => structuredClone(item)); }
}