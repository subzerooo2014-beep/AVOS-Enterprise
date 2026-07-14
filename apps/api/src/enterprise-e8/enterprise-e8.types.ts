export type EnterpriseRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type EnterpriseDecisionStatus =
  | "PROPOSED"
  | "APPROVED"
  | "EXECUTED"
  | "BLOCKED";

export interface EnterpriseSignal {
  id: string;
  domain: string;
  metric: string;
  value: number;
  threshold: number;
  severity: EnterpriseRiskLevel;
  detectedAt: string;
}

export interface EnterpriseScenario {
  id: string;
  name: string;
  domain: string;
  probability: number;
  impactScore: number;
  riskLevel: EnterpriseRiskLevel;
  recommendedAction: string;
  simulatedAt: string;
}

export interface EnterpriseDecision {
  id: string;
  title: string;
  domain: string;
  rationale: string;
  action: string;
  confidence: number;
  status: EnterpriseDecisionStatus;
  createdAt: string;
  executedAt?: string;
}

export interface EnterpriseResilienceSnapshot {
  signals: number;
  scenarios: number;
  decisions: number;
  executedDecisions: number;
  blockedDecisions: number;
  resilienceScore: number;
  decisionReadiness: number;
  generatedAt: string;
}