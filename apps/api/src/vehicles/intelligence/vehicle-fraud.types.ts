export interface VehicleFraudResult {
  score: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
  duplicateVin: boolean;
  blacklistMatch: boolean;
  recommendations: string[];
}
