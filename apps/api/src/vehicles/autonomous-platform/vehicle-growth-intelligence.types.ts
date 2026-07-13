export interface VehicleGrowthIntelligenceInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
}

export interface VehicleGrowthIntelligenceResult {
  vehicleId: string;
  growthScore: number;
  status: "STRONG" | "WATCH" | "WEAK";
  recommendations: string[];
}
