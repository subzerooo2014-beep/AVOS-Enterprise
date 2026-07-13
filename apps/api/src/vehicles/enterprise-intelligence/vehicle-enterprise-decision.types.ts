export interface VehicleEnterpriseDecisionInput {
  approvalScore: number;
  marketplaceScore: number;
  financeEligible: boolean;
  insuranceEligible: boolean;
  fraudRisk: "LOW" | "MEDIUM" | "HIGH";
}

export interface VehicleEnterpriseDecisionResult {
  decision: "PUBLISH" | "REVIEW" | "BLOCK";
  confidence: number;
  priority: "LOW" | "NORMAL" | "HIGH";
  actions: string[];
}
