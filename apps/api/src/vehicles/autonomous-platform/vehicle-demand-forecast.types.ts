export interface VehicleDemandForecastInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
}

export interface VehicleDemandForecastResult {
  vehicleId: string;
  demandScore: number;
  status: "STRONG" | "WATCH" | "WEAK";
  recommendations: string[];
}
