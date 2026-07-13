export interface VehicleRecommendationInput {
  buyerMatchScore: number;
  vehicleQualityScore: number;
  marketDemandScore: number;
  dealerScore: number;
  priceCompetitiveness: number;
}

export interface VehicleRecommendationResult {
  recommendationScore: number;
  rank: "TOP_PICK" | "RECOMMENDED" | "CONSIDER" | "HIDDEN";
  reasons: string[];
}
