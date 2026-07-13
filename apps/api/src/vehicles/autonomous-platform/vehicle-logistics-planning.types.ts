export interface VehicleLogisticsPlanningInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
}

export interface VehicleLogisticsPlanningResult {
  vehicleId: string;
  logisticsScore: number;
  status: "STRONG" | "WATCH" | "WEAK";
  recommendations: string[];
}
