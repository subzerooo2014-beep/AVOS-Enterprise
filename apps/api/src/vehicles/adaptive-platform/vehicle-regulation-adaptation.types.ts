export interface VehicleRegulationAdaptationInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
  readinessScore: number;
}

export interface VehicleRegulationAdaptationResult {
  vehicleId: string;
  adaptationScore: number;
  status: "ADVANCED" | "DEVELOPING" | "LIMITED";
  actions: string[];
}
