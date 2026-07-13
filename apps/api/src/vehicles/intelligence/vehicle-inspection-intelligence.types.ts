export interface VehicleInspectionIntelligenceResult {
  score: number;
  status: "READY" | "REVIEW_REQUIRED" | "INSPECTION_REQUIRED";
  riskSignals: string[];
  recommendations: string[];
}
