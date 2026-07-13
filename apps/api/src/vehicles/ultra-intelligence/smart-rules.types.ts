export interface SmartRulesContext {
  qualityScore: number;
  trustScore: number;
  fraudRisk: "LOW" | "MEDIUM" | "HIGH";
  inspectionPassed: boolean;
}

export interface SmartRulesResult {
  allowed: boolean;
  triggeredRules: string[];
  actions: string[];
}
