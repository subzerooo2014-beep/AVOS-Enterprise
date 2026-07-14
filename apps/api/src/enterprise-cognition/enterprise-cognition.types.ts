export const ENTERPRISE_COGNITION_CAPABILITIES = [
  'enterprise-cognitive-engine',
  'autonomous-reasoning-engine',
  'multi-agent-decision-intelligence',
  'enterprise-knowledge-synthesis',
  'strategic-planning-intelligence',
  'predictive-organizational-intelligence',
  'executive-decision-support',
  'cross-domain-intelligence-fusion',
  'enterprise-cognitive-dashboard',
] as const;

export type EnterpriseCognitionCapability =
  (typeof ENTERPRISE_COGNITION_CAPABILITIES)[number];

export type ConfidenceBand = 'low' | 'medium' | 'high' | 'very-high';

export interface CognitionSignal {
  id: string;
  domain: string;
  source: string;
  value: number;
  confidence: number;
  observedAt: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ReasoningHypothesis {
  id: string;
  statement: string;
  supportingSignals: string[];
  contradictingSignals: string[];
  confidence: number;
}

export interface AgentDecision {
  agent: string;
  recommendation: string;
  confidence: number;
  rationale: string[];
}

export interface StrategicPlan {
  id: string;
  objective: string;
  horizonDays: number;
  priorities: string[];
  actions: string[];
  risks: string[];
  expectedImpact: number;
}

export interface ExecutiveDecisionBrief {
  generatedAt: string;
  decision: string;
  confidence: number;
  confidenceBand: ConfidenceBand;
  rationale: string[];
  risks: string[];
  recommendedActions: string[];
}

export interface CognitiveDashboardSnapshot {
  generatedAt: string;
  cognitionScore: number;
  reasoningConfidence: number;
  organizationalReadiness: number;
  activeDomains: number;
  capabilityStatus: Record<EnterpriseCognitionCapability, 'operational'>;
}