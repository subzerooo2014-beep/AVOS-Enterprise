export const ENTERPRISE_RESILIENCE_CONTINUITY_CAPABILITIES = [
  'enterprise-resilience-engine',
  'operational-risk-intelligence',
  'business-continuity-orchestrator',
  'autonomous-crisis-response',
  'failure-prediction-engine',
  'self-healing-enterprise-runtime',
  'disaster-recovery-intelligence',
  'critical-dependency-mapper',
  'continuity-policy-engine',
  'resilience-simulation-laboratory',
  'executive-crisis-command-center',
  'resilience-continuity-dashboard',
] as const;

export type EnterpriseResilienceContinuityCapability =
  (typeof ENTERPRISE_RESILIENCE_CONTINUITY_CAPABILITIES)[number];

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus =
  | 'detected'
  | 'contained'
  | 'recovering'
  | 'resolved'
  | 'escalated';

export interface OperationalRisk {
  id: string;
  domain: string;
  probability: number;
  impact: number;
  detectability: number;
  mitigation: string;
}

export interface CriticalDependency {
  id: string;
  name: string;
  domain: string;
  criticality: number;
  recoveryTimeObjectiveMinutes: number;
  recoveryPointObjectiveMinutes: number;
  dependencies: string[];
}

export interface ResilienceSignal {
  id: string;
  domain: string;
  health: number;
  redundancy: number;
  recoveryReadiness: number;
  observedAt: string;
}

export interface CrisisIncident {
  id: string;
  title: string;
  domain: string;
  severity: RiskSeverity;
  status: IncidentStatus;
  detectedAt: string;
  affectedDependencies: string[];
}

export interface ContinuityPolicy {
  id: string;
  name: string;
  minimumHealth: number;
  maximumRecoveryTimeMinutes: number;
  requiresExecutiveApproval: boolean;
}

export interface RecoveryPlan {
  incidentId: string;
  actions: string[];
  estimatedRecoveryMinutes: number;
  escalationRequired: boolean;
  targetStatus: IncidentStatus;
}

export interface ResilienceSimulationScenario {
  id: string;
  name: string;
  failedDependencies: string[];
  trafficMultiplier: number;
  dataLossMinutes: number;
}

export interface ResilienceDashboardSnapshot {
  generatedAt: string;
  resilienceScore: number;
  riskExposure: number;
  continuityReadiness: number;
  activeIncidents: number;
  recoveryCapacity: number;
  capabilityStatus: Record<
    EnterpriseResilienceContinuityCapability,
    'operational'
  >;
}