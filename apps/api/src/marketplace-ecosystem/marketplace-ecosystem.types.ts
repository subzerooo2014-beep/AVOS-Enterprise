export type MarketplaceEntityType =
  | "DEALERSHIP"
  | "WORKSHOP"
  | "PARTS_SELLER"
  | "ACCESSORIES_SELLER"
  | "SERVICE_PROVIDER";

export type MarketplaceStatus =
  | "DRAFT"
  | "ACTIVE"
  | "SUSPENDED"
  | "VERIFIED"
  | "REJECTED";

export interface MarketplaceEntityRecord {
  id: string;
  type: MarketplaceEntityType;
  ownerId: string;
  name: string;
  status: MarketplaceStatus;
  trustScore: number;
  rating: number;
  membershipPlan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceListingRecord {
  id: string;
  entityId: string;
  category: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
