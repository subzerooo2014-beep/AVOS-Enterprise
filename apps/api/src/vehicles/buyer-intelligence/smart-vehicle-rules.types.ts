export interface SmartVehicleRuleContext {
  qualityScore: number;
  trustScore: number;
  fraudRisk: "LOW" | "MEDIUM" | "HIGH";
  recommendationScore: number;
  inspectionPassed: boolean;
}

export interface SmartVehicleRuleResult {
  allowed: boolean;
  ruleScore: number;
  triggeredRules: string[];
  actions: string[];
}
