export interface VehicleMarketAnalysisResult {
  score: number;
  demandLevel: "LOW" | "MEDIUM" | "HIGH";
  liquidityLevel: "LOW" | "MEDIUM" | "HIGH";
  estimatedDaysToSell: number;
  recommendations: string[];
}
