export interface VehicleCapabilityFusionInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
  readinessScore: number;
}

export interface VehicleCapabilityFusionResult {
  vehicleId: string;
  fusionScore: number;
  status: "ADVANCED" | "DEVELOPING" | "LIMITED";
  actions: string[];
}
