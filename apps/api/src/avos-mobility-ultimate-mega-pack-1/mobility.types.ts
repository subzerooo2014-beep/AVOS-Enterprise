export type MobilityEntityStatus =
  | 'draft'
  | 'active'
  | 'suspended'
  | 'sold'
  | 'archived';

export type ListingLifecycleStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'reserved'
  | 'sold'
  | 'rejected'
  | 'archived';

export interface Money {
  amount: number;
  currency: string;
}

export interface MobilityContext {
  countryCode: string;
  language: string;
  currency: string;
}

export interface VehicleRecord {
  id: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileageKm: number;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  condition: 'new' | 'used' | 'certified';
  price: Money;
  dealerId?: string;
  city?: string;
  countryCode: string;
  status: MobilityEntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DealerRecord {
  id: string;
  name: string;
  countryCode: string;
  city?: string;
  verified: boolean;
  trustScore: number;
  status: MobilityEntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ListingRecord {
  id: string;
  vehicleId: string;
  sellerType: 'private' | 'dealer' | 'fleet' | 'government';
  sellerId: string;
  title: string;
  description?: string;
  status: ListingLifecycleStatus;
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleSearchQuery {
  q?: string;
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  countryCode?: string;
  city?: string;
  dealerId?: string;
  status?: MobilityEntityStatus;
  limit?: number;
}

export interface AiPriceAssessment {
  vehicleId?: string;
  currency: string;
  estimatedPrice: number;
  confidence: number;
  factors: string[];
  requiresHumanApproval: boolean;
}

export interface MobilityReadinessResult {
  score: number;
  state: 'ready' | 'degraded' | 'blocked';
  checks: Record<string, boolean>;
  blockers: string[];
  timestamp: string;
}