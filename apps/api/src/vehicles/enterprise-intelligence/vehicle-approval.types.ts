export type VehicleApprovalDecision =
  | "AUTO_APPROVE"
  | "MANUAL_REVIEW"
  | "REJECT";

export interface VehicleApprovalContext {
  qualityScore: number;
  fraudRisk: "LOW" | "MEDIUM" | "HIGH";
  marketDemand: number;
  inspectionScore: number;
  financeEligible: boolean;
  insuranceEligible: boolean;
}

export interface VehicleApprovalResult {
  decision: VehicleApprovalDecision;
  score: number;
  confidence: number;
  reasons: string[];
  nextActions: string[];
}
