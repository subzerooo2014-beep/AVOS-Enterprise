export interface VehiclePartnerNetworkInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
}

export interface VehiclePartnerNetworkResult {
  vehicleId: string;
  partnerScore: number;
  status: "STRONG" | "WATCH" | "WEAK";
  recommendations: string[];
}
