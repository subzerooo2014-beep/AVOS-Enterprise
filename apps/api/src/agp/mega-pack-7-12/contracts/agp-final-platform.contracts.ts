export type GovernanceDomain =
  | "growth"
  | "campaign"
  | "revenue"
  | "pricing"
  | "experiment"
  | "funnel"
  | "journey"
  | "attribution"
  | "forecast"
  | "opportunity"
  | "executive";

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired";
export type ControlStatus = "active" | "inactive" | "degraded";

export interface GovernancePolicy {
  id: string;
  name: string;
  domain: GovernanceDomain;
  version: string;
  rules: string[];
  status: "draft" | "active" | "retired";
  requiresHumanApproval: boolean;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRecord {
  id: string;
  subjectType: string;
  subjectId: string;
  requestedBy: string;
  status: ApprovalStatus;
  approver?: string;
  reason?: string;
  requestedAt: string;
  decidedAt?: string;
}

export interface DecisionTrace {
  id: string;
  decisionType: string;
  subjectId: string;
  inputs: Record<string, unknown>;
  evidenceIds: string[];
  policyIds: string[];
  explanation: string;
  outcome: string;
  confidence: number;
  humanAuthorityRequired: boolean;
  approvedBy?: string;
  createdAt: string;
}

export interface EvidenceRecord {
  id: string;
  source: string;
  category: string;
  hash: string;
  metadata: Record<string, string>;
  collectedAt: string;
}

export interface RiskRecord {
  id: string;
  domain: string;
  description: string;
  level: RiskLevel;
  probability: number;
  impact: number;
  score: number;
  controls: string[];
  status: "open" | "mitigated" | "accepted";
  owner: string;
  createdAt: string;
}

export interface ComplianceEvaluation {
  id: string;
  jurisdiction: string;
  domain: string;
  passed: boolean;
  score: number;
  requirements: Array<{
    name: string;
    passed: boolean;
    evidence: string[];
  }>;
  exceptions: string[];
  evaluatedAt: string;
}

export interface TenantControl {
  tenantId: string;
  quotas: Record<string, number>;
  featureFlags: Record<string, boolean>;
  rateLimits: Record<string, number>;
  jurisdiction: string;
  isolationMode: "logical" | "dedicated";
  status: ControlStatus;
  updatedAt: string;
}

export interface SecurityAssessment {
  id: string;
  tenantId?: string;
  score: number;
  controls: Record<string, boolean>;
  findings: string[];
  assessedAt: string;
}

export interface DeadLetterRecord {
  id: string;
  source: string;
  payload: unknown;
  reason: string;
  attempts: number;
  status: "pending" | "replayed" | "discarded";
  createdAt: string;
  replayedAt?: string;
}

export interface OperationalMetric {
  name: string;
  value: number;
  unit: string;
  dimensions: Record<string, string>;
  recordedAt: string;
}

export interface FinalPlatformScores {
  architectureScore: number;
  governanceScore: number;
  securityScore: number;
  complianceScore: number;
  riskScore: number;
  trustScore: number;
  resilienceScore: number;
  observabilityScore: number;
  productionReadinessScore: number;
  tenantIsolationScore: number;
  integrationScore: number;
  crossPackVerificationScore: number;
  smokeTestScore: number;
  finalPlatformScore: number;
}