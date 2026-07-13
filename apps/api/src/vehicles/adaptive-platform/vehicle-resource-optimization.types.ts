export interface VehicleResourceOptimizationInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
  readinessScore: number;
}

export interface VehicleResourceOptimizationResult {
  vehicleId: string;
  resourceScore: number;
  status: "ADVANCED" | "DEVELOPING" | "LIMITED";
  actions: string[];
}
