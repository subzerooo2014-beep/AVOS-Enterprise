export type AvosFactoryPolicyEffect =
  | "allow"
  | "deny"
  | "require-approval";

export type AvosFactorySecuritySeverity =
  | "info"
  | "warning"
  | "high"
  | "critical";

export interface AvosFactorySecurityPolicy {
  id: string;
  name: string;
  description: string;
  resourceType: string;
  action: string;
  effect: AvosFactoryPolicyEffect;
  priority: number;
  enabled: boolean;
  conditions: Record<string, string | number | boolean>;
  requiresHumanApproval: boolean;
  createdAt: string;
}

export interface AvosFactoryPolicyEvaluationContext {
  actor: string;
  resourceType: string;
  resourceId?: string;
  action: string;
  environment?: string;
  attributes?: Record<string, string | number | boolean>;
}

export interface AvosFactoryPolicyDecision {
  id: string;
  actor: string;
  resourceType: string;
  resourceId?: string;
  action: string;
  allowed: boolean;
  effect: AvosFactoryPolicyEffect;
  matchedPolicyIds: string[];
  reasons: string[];
  requiresHumanApproval: boolean;
  evaluatedAt: string;
}

export interface AvosFactorySecurityFinding {
  id: string;
  subjectId: string;
  category:
    | "access"
    | "policy"
    | "secret"
    | "dependency"
    | "configuration"
    | "governance";
  severity: AvosFactorySecuritySeverity;
  title: string;
  description: string;
  evidence: Record<string, unknown>;
  status: "open" | "resolved" | "accepted-risk";
  detectedAt: string;
  resolvedAt?: string;
}

export interface AvosFactorySecurityAssessment {
  id: string;
  subjectId: string;
  score: number;
  passed: boolean;
  findings: AvosFactorySecurityFinding[];
  criticalFindings: number;
  highFindings: number;
  generatedAt: string;
}

export interface AvosFactoryPolicyException {
  id: string;
  policyId: string;
  subjectId: string;
  reason: string;
  requestedBy: string;
  status: "pending" | "approved" | "rejected" | "expired";
  approvedBy?: string;
  humanApproved: boolean;
  createdAt: string;
  expiresAt?: string;
  decidedAt?: string;
}

export interface AvosFactorySecuritySmokeReport {
  id: string;
  success: boolean;
  score: number;
  checks: Record<string, boolean>;
  blockingFindings: string[];
  generatedAt: string;
}
