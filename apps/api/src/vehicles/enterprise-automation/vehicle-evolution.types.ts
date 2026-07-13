export interface VehicleEvolutionInput {
  currentQualityScore: number;
  currentMarketScore: number;
  currentConversionRate: number;
}

export interface VehicleEvolutionResult {
  evolutionScore: number;
  recommendations: string[];
  nextStage: "OPTIMIZE" | "SCALE" | "REBUILD";
}
