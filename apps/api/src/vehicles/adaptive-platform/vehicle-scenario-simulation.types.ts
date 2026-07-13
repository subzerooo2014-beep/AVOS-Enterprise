export interface VehicleScenarioSimulationInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
  readinessScore: number;
}

export interface VehicleScenarioSimulationResult {
  vehicleId: string;
  scenarioScore: number;
  status: "ADVANCED" | "DEVELOPING" | "LIMITED";
  actions: string[];
}
