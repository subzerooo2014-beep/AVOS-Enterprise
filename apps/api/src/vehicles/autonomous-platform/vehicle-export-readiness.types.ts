export interface VehicleExportReadinessInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
}

export interface VehicleExportReadinessResult {
  vehicleId: string;
  exportScore: number;
  status: "STRONG" | "WATCH" | "WEAK";
  recommendations: string[];
}
