export const ENTERPRISE_STRATEGIC_GOVERNANCE_CAPABILITIES = [
  'autonomous-strategy-engine',
  'enterprise-objective-management',
  'portfolio-governance-engine',
  'strategic-risk-intelligence',
  'enterprise-kpi-intelligence',
  'autonomous-okr-engine',
  'executive-governance-center',
  'enterprise-decision-audit',
  'strategy-simulation-engine',
  'strategic-intelligence-dashboard',
] as const;

export type EnterpriseStrategicGovernanceCapability =
  (typeof ENTERPRISE_STRATEGIC_GOVERNANCE_CAPABILITIES)[number];

export type ObjectiveStatus =
  | 'draft'
  | 'active'
  | 'at-risk'
  | 'completed'
  | 'cancelled';

export type DecisionOutcome = 'approved' | 'rejected' | 'conditional';

export interface EnterpriseObjective {
  id: string;
  title: string;
  owner: string;
  priority: number;
  targetValue: number;
  currentValue: number;
  dueDate: string;
  status: ObjectiveStatus;
}

export interface PortfolioInitiative {
  id: string;
  name: string;
  strategicFit: number;
  expectedValue: number;
  cost: number;
  riskScore: number;
  dependencies: string[];
}

export interface StrategicRisk {
  id: string;
  category: string;
  probability: number;
  impact: number;
  mitigation: string;
}

export interface EnterpriseKpi {
  id: string;
  name: string;
  target: number;
  actual: number;
  weight: number;
}

export interface EnterpriseOkr {
  id: string;
  objective: string;
  keyResults: Array<{
    id: string;
    description: string;
    target: number;
    actual: number;
  }>;
}

export interface StrategyScenario {
  id: string;
  name: string;
  assumptions: Record<string, number>;
  expectedValue: number;
  riskScore: number;
  confidence: number;
}

export interface GovernanceDecision {
  id: string;
  subject: string;
  outcome: DecisionOutcome;
  rationale: string[];
  conditions: string[];
  decidedAt: string;
}

export interface DecisionAuditRecord {
  id: string;
  decisionId: string;
  actor: string;
  action: string;
  timestamp: string;
  metadata: Record<string, string | number | boolean>;
}

export interface StrategicDashboardSnapshot {
  generatedAt: string;
  strategyScore: number;
  objectiveCompletion: number;
  portfolioValue: number;
  riskExposure: number;
  kpiHealth: number;
  capabilityStatus: Record<
    EnterpriseStrategicGovernanceCapability,
    'operational'
  >;
}