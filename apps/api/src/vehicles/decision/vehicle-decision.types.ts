export type VehicleDecision =
  | "AUTO_APPROVE"
  | "MANUAL_REVIEW"
  | "REJECT";

export type FraudRisk =
  | "low"
  | "medium"
  | "high";

export interface VehicleReadinessResult {
  qualityScore: number;
  fraudRisk: FraudRisk;

  inspectionReady: boolean;

  financeEligible: boolean;

  insuranceEligible: boolean;

  marketplaceEligible: boolean;

  publishingAllowed: boolean;

  marketplaceScore: number;

  decision: VehicleDecision;

  confidence: number;

  priority:
    | "low"
    | "normal"
    | "high";

  reasons: string[];

  nextActions: string[];
}
