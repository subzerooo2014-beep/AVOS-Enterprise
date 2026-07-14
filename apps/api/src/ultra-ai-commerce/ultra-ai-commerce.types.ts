export type IntelligenceDecision = "ALLOW" | "REVIEW" | "BLOCK";
export type RecommendationKind =
  | "VEHICLE"
  | "FINANCE"
  | "INSURANCE"
  | "INSPECTION"
  | "EXPORT"
  | "PRICE"
  | "NEGOTIATION";

export interface IntelligenceContext {
  buyerId?: string;
  sellerId?: string;
  vehicleId?: string;
  dealId?: string;
  market?: string;
  currency?: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
}

export interface IntelligenceScore {
  score: number;
  confidence: number;
  reasons: string[];
}

export interface IntelligenceRecommendation {
  id: string;
  kind: RecommendationKind;
  title: string;
  description: string;
  priority: number;
  score: number;
  createdAt: string;
}

export interface VehicleIntelligenceInput {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  askingPrice: number;
  conditionScore: number;
  accidentCount?: number;
  serviceHistoryScore?: number;
  marketAveragePrice?: number;
}

export interface BuyerMatchingInput {
  buyerId: string;
  budget: number;
  preferredBrands: string[];
  preferredBodyTypes: string[];
  location: string;
  financingRequired: boolean;
  vehicles: Array<{
    id: string;
    brand: string;
    bodyType: string;
    price: number;
    location: string;
    trustScore: number;
    conditionScore: number;
  }>;
}
