export interface VehicleTrustOrchestrationInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
}

export interface VehicleTrustOrchestrationResult {
  vehicleId: string;
  trustScore: number;
  status: "STRONG" | "WATCH" | "WEAK";
  recommendations: string[];
}
