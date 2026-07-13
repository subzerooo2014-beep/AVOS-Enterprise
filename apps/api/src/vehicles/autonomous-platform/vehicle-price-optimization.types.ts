export interface VehiclePriceOptimizationInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
}

export interface VehiclePriceOptimizationResult {
  vehicleId: string;
  optimizedPrice: number;
  status: "STRONG" | "WATCH" | "WEAK";
  recommendations: string[];
}
