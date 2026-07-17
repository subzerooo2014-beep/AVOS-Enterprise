export type DecisionStatus = "draft" | "evaluating" | "recommended" | "approved" | "rejected" | "executed" | "failed";
export type DecisionRiskLevel = "low" | "medium" | "high" | "critical";

export interface DecisionOption {
  id: string;
  title: string;
  description?: string;
  expectedBenefit: number;
  expectedCost: number;
  risk: number;
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface DecisionPolicyResult {
  allowed: boolean;
  reasons: string[];
  appliedPolicies: string[];
}

export interface DecisionRuleResult {
  matchedRules: string[];
  scoreAdjustment: number;
  reasons: string[];
}

export interface DecisionSimulationResult {
  optionId: string;
  projectedScore: number;
  projectedBenefit: number;
  projectedCost: number;
  projectedRisk: number;
  assumptions: string[];
}

export interface DecisionRecommendation {
  rank: number;
  optionId: string;
  score: number;
  confidence: number;
  reasons: string[];
}

export interface DecisionTrace {
  id: string;
  decisionId: string;
  step: string;
  message: string;
  data?: Record<string, unknown>;
  createdAt: string;
}

export interface EnterpriseDecisionRecord {
  id: string;
  subject: string;
  context: Record<string, unknown>;
  options: DecisionOption[];
  recommendations: DecisionRecommendation[];
  selectedOptionId?: string;
  status: DecisionStatus;
  riskLevel: DecisionRiskLevel;
  confidence: number;
  explanation: string[];
  policyResult: DecisionPolicyResult;
  ruleResult: DecisionRuleResult;
  simulations: DecisionSimulationResult[];
  traces: DecisionTrace[];
  createdAt: string;
  updatedAt: string;
}