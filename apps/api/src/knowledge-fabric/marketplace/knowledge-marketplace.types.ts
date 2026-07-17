export type MarketplaceListingState = "DRAFT" | "PUBLISHED" | "SUSPENDED" | "RETIRED";
export type MarketplaceOrderState = "CREATED" | "APPROVED" | "FULFILLED" | "CANCELLED" | "FAILED";
export type MarketplaceLicenseType = "INTERNAL" | "PARTNER" | "COMMERCIAL" | "OPEN";
export type MarketplacePricingModel = "FREE" | "FIXED" | "USAGE" | "SUBSCRIPTION";

export interface KnowledgeMarketplaceListing {
  id: string;
  knowledgeId: string;
  title: string;
  description: string;
  ownerId: string;
  categories: string[];
  tags: string[];
  licenseType: MarketplaceLicenseType;
  pricingModel: MarketplacePricingModel;
  price: number;
  currency: string;
  state: MarketplaceListingState;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeMarketplaceLicense {
  id: string;
  listingId: string;
  buyerId: string;
  licenseType: MarketplaceLicenseType;
  rights: string[];
  restrictions: string[];
  validFrom: string;
  validUntil?: string;
  active: boolean;
}

export interface KnowledgeMarketplaceOrder {
  id: string;
  listingId: string;
  buyerId: string;
  quantity: number;
  amount: number;
  currency: string;
  state: MarketplaceOrderState;
  licenseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeMarketplaceDelivery {
  id: string;
  orderId: string;
  knowledgeId: string;
  version: string;
  checksum: string;
  deliveredAt: string;
  receipt: string;
}

export interface KnowledgeMarketplaceSearchQuery {
  text?: string;
  category?: string;
  tags?: string[];
  ownerId?: string;
  licenseType?: MarketplaceLicenseType;
  maxPrice?: number;
}