export type VehicleRiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface VehicleIntelligenceResult {

  fraudScore: number;

  marketScore: number;

  inspectionScore: number;

  pricingScore: number;

  confidence: number;

  risk: VehicleRiskLevel;

  recommendations: string[];

}
