export const VEHICLE_MARKETPLACE_OPERATIONS_CAPABILITIES = [
  'listing-lifecycle-engine',
  'marketplace-media-manager',
  'vehicle-inventory-engine',
  'smart-pricing-coordinator',
  'marketplace-search-index',
  'vehicle-recommendation-engine',
  'dealer-operations-engine',
  'marketplace-analytics-engine',
  'listing-fraud-protection',
  'reservation-negotiation-engine',
  'marketplace-event-orchestrator',
  'marketplace-operations-dashboard',
] as const;

export type VehicleMarketplaceCapability =
  (typeof VEHICLE_MARKETPLACE_OPERATIONS_CAPABILITIES)[number];

export type ListingStatus =
  | 'draft'
  | 'pending-review'
  | 'published'
  | 'paused'
  | 'reserved'
  | 'sold'
  | 'archived'
  | 'rejected';

export interface VehicleListing {
  id: string;
  sellerId: string;
  dealerId?: string;
  vehicleId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: ListingStatus;
  region: string;
  city: string;
  vin?: string;
  mileage: number;
  year: number;
  make: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingMedia {
  id: string;
  listingId: string;
  type: 'image' | 'video' | 'document';
  url: string;
  order: number;
  isCover: boolean;
  checksum?: string;
}

export interface InventoryRecord {
  id: string;
  listingId: string;
  branchId?: string;
  quantity: number;
  state: 'available' | 'reserved' | 'sold' | 'inactive';
}

export interface PricingSignal {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  askingPrice: number;
  marketPrice: number;
  confidence: number;
}

export interface SearchDocument {
  id: string;
  listingId: string;
  text: string;
  make: string;
  model: string;
  year: number;
  price: number;
  region: string;
  status: ListingStatus;
}

export interface MarketplaceMetric {
  listingId: string;
  views: number;
  inquiries: number;
  saves: number;
  reservations: number;
  conversions: number;
}

export interface FraudSignal {
  id: string;
  listingId: string;
  type: string;
  riskScore: number;
  evidence: string[];
}

export interface MarketplaceDashboardSnapshot {
  generatedAt: string;
  publishedListings: number;
  activeInventory: number;
  averagePriceConfidence: number;
  fraudRisk: number;
  conversionRate: number;
  capabilityStatus: Record<
    VehicleMarketplaceCapability,
    'operational'
  >;
}