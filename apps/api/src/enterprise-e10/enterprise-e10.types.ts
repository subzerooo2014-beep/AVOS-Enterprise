export type EnterpriseValueStatus =
  | "IDENTIFIED"
  | "APPROVED"
  | "REALIZING"
  | "REALIZED"
  | "AT_RISK";

export interface EnterpriseValueOpportunity {
  id: string;
  name: string;
  domain: string;
  expectedValue: number;
  confidence: number;
  timeToValueDays: number;
  riskScore: number;
  status: EnterpriseValueStatus;
  createdAt: string;
}

export interface EnterpriseValueOutcome {
  id: string;
  opportunityId: string;
  measuredValue: number;
  targetValue: number;
  realizationRate: number;
  leakageValue: number;
  measuredAt: string;
}

export interface EnterpriseValueAction {
  id: string;
  opportunityId: string;
  action: string;
  approved: boolean;
  executed: boolean;
  createdAt: string;
  executedAt?: string;
}

export interface EnterpriseValueSnapshot {
  opportunities: number;
  outcomes: number;
  actions: number;
  executedActions: number;
  atRiskOpportunities: number;
  totalExpectedValue: number;
  totalMeasuredValue: number;
  valueRealizationScore: number;
  generatedAt: string;
}