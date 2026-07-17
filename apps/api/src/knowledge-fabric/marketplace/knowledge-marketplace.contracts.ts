import {
  KnowledgeMarketplaceDelivery,
  KnowledgeMarketplaceLicense,
  KnowledgeMarketplaceListing,
  KnowledgeMarketplaceOrder,
  KnowledgeMarketplaceSearchQuery,
} from "./knowledge-marketplace.types";

export interface KnowledgeMarketplaceCatalogContract {
  createListing(input: Omit<KnowledgeMarketplaceListing, "id" | "state" | "createdAt" | "updatedAt">): KnowledgeMarketplaceListing;
  publishListing(id: string): KnowledgeMarketplaceListing;
  search(query: KnowledgeMarketplaceSearchQuery): KnowledgeMarketplaceListing[];
}

export interface KnowledgeMarketplaceOrderContract {
  createOrder(listingId: string, buyerId: string, quantity?: number): KnowledgeMarketplaceOrder;
  fulfillOrder(orderId: string): { order: KnowledgeMarketplaceOrder; license: KnowledgeMarketplaceLicense; delivery: KnowledgeMarketplaceDelivery };
}