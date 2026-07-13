export interface VehicleFinanceInsuranceInput {
  vehiclePrice: number;
  vehicleAge: number;
  qualityScore: number;
  fraudRisk: "LOW" | "MEDIUM" | "HIGH";
}

export interface VehicleFinanceInsuranceResult {
  financeEligible: boolean;
  insuranceEligible: boolean;
  riskBand: "LOW" | "MEDIUM" | "HIGH";
  maxFinanceRatio: number;
  reasons: string[];
}
