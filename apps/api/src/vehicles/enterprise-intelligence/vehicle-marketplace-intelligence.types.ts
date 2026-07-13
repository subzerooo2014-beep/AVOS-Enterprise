export interface VehicleMarketplaceInput {
  qualityScore: number;
  demandScore: number;
  trustScore: number;
  priceCompetitiveness: number;
}

export interface VehicleMarketplaceIntelligenceResult {
  marketplaceScore: number;
  rankingTier: "PREMIUM" | "STANDARD" | "LIMITED";
  recommendedBoost: number;
  reasons: string[];
}
