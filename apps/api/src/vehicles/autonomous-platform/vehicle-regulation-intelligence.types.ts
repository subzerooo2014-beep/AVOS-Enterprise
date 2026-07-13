export interface VehicleRegulationIntelligenceInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
}

export interface VehicleRegulationIntelligenceResult {
  vehicleId: string;
  complianceScore: number;
  status: "STRONG" | "WATCH" | "WEAK";
  recommendations: string[];
}
