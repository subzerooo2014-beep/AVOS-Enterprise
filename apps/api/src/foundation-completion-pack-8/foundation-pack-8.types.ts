export type GovernanceScope =
  | "platform"
  | "capability"
  | "product"
  | "agent"
  | "workflow"
  | "data"
  | "integration"
  | "organization";

export type GovernanceRuleEffect =
  | "allow"
  | "deny"
  | "require"
  | "warn";

export type GovernancePolicyStatus =
  | "draft"
  | "review"
  | "active"
  | "suspended"
  | "retired";

export type ComplianceStatus =
  | "compliant"
  | "partially-compliant"
  | "non-compliant"
  | "not-assessed";

export type RiskLevel =
  | "low"
  | "moderate"
  | "high"
  | "critical";

export type LifecycleStage =
  | "concept"
  | "prototype"
  | "shared-capability"
  | "core-engine"
  | "platform-service"
  | "standalone-product"
  | "legacy-asset";

export type GovernanceExceptionStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "expired"
  | "revoked";

export type EnforcementStatus =
  | "passed"
  | "blocked"
  | "warning"
  | "pending-human-review";

export interface DigitalConstitutionPrinciple {
  id: string;
  name: string;
  description: string;
  priority: number;
  immutable: boolean;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GovernancePolicyRule {
  id: string;
  field: string;
  operator:
    | "equals"
    | "not-equals"
    | "contains"
    | "not-contains"
    | "greater-than"
    | "greater-than-or-equal"
    | "less-than"
    | "less-than-or-equal"
    | "exists"
    | "not-exists"
    | "in";
  value?: unknown;
  effect: GovernanceRuleEffect;
  message: string;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  description: string;
  scope: GovernanceScope;
  status: GovernancePolicyStatus;
  version: string;
  priority: number;
  principleIds: string[];
  standardIds: string[];
  rules: GovernancePolicyRule[];
  ownerIdentityId: string;
  requiresHumanApproval: boolean;
  effectiveFrom?: string;
  effectiveUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceStandard {
  id: string;
  name: string;
  description: string;
  category:
    | "architecture"
    | "security"
    | "data"
    | "ai"
    | "operations"
    | "quality"
    | "compliance";
  version: string;
  mandatory: boolean;
  controlIds: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  standardId: string;
  policyIds: string[];
  evidenceRequirements: string[];
  severity: RiskLevel;
  automated: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceAssessment {
  id: string;
  subjectId: string;
  subjectType: GovernanceScope;
  controlId: string;
  status: ComplianceStatus;
  score: number;
  findings: string[];
  evidenceIds: string[];
  assessedByIdentityId: string;
  assessedAt: string;
}

export interface EnterpriseRiskRecord {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectType: GovernanceScope;
  category:
    | "strategic"
    | "operational"
    | "security"
    | "compliance"
    | "financial"
    | "reputation"
    | "technology";
  likelihood: number;
  impact: number;
  inherentScore: number;
  residualScore: number;
  level: RiskLevel;
  mitigationActions: string[];
  ownerIdentityId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceLifecycleRecord {
  id: string;
  subjectId: string;
  subjectType: GovernanceScope;
  currentStage: LifecycleStage;
  previousStage?: LifecycleStage;
  transitionReason: string;
  transitionedByIdentityId: string;
  approvedByIdentityId?: string;
  governanceChecks: string[];
  transitionedAt: string;
}

export interface GovernanceException {
  id: string;
  subjectId: string;
  subjectType: GovernanceScope;
  policyId: string;
  requestedByIdentityId: string;
  reason: string;
  compensatingControls: string[];
  status: GovernanceExceptionStatus;
  approverIdentityId?: string;
  decisionNote?: string;
  requestedAt: string;
  decidedAt?: string;
  expiresAt?: string;
}

export interface EnforcementDecision {
  id: string;
  subjectId: string;
  subjectType: GovernanceScope;
  correlationId: string;
  action: string;
  status: EnforcementStatus;
  matchedPolicyIds: string[];
  failedRuleIds: string[];
  warnings: string[];
  reasons: string[];
  requiresHumanApproval: boolean;
  evaluatedByIdentityId: string;
  evaluatedAt: string;
}

export interface GovernanceEvidenceRecord {
  id: string;
  subjectId: string;
  subjectType: GovernanceScope;
  controlId?: string;
  policyId?: string;
  evidenceType:
    | "document"
    | "test-result"
    | "audit-record"
    | "approval"
    | "metric"
    | "configuration"
    | "event";
  referenceId: string;
  description: string;
  verified: boolean;
  verifiedByIdentityId?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface GovernanceAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "constitution"
    | "policy"
    | "standard"
    | "compliance"
    | "risk"
    | "lifecycle"
    | "exception"
    | "enforcement"
    | "evidence";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "blocked" | "warning";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
