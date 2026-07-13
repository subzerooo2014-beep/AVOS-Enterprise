export interface RecommendationIntelligenceInput {
  buyerMatchScore: number;
  vehicleQualityScore: number;
  marketDemandScore: number;
  dealerScore: number;
}

export interface RecommendationIntelligenceResult {
  score: number;
  rank: "TOP_PICK" | "RECOMMENDED" | "CONSIDER" | "HIDDEN";
}
