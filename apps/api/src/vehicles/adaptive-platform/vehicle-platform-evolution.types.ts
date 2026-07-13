export interface VehiclePlatformEvolutionInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
  readinessScore: number;
}

export interface VehiclePlatformEvolutionResult {
  vehicleId: string;
  evolutionScore: number;
  status: "ADVANCED" | "DEVELOPING" | "LIMITED";
  actions: string[];
}
