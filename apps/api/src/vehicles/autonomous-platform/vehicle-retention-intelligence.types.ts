export interface VehicleRetentionIntelligenceInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
}

export interface VehicleRetentionIntelligenceResult {
  vehicleId: string;
  retentionScore: number;
  status: "STRONG" | "WATCH" | "WEAK";
  recommendations: string[];
}
