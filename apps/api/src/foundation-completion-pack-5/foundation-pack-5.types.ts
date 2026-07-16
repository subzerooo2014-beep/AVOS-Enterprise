export type GovernanceStatus =
  | "draft"
  | "pending-approval"
  | "active"
  | "suspended"
  | "deprecated"
  | "retired";

export type GovernanceSeverity = "low" | "medium" | "high" | "critical";

export type LifecycleAssetType = "capability" | "product" | "idea";

export type CapabilityLifecycleStage =
  | "concept"
  | "prototype"
  | "shared-capability"
  | "core-engine"
  | "platform-service"
  | "standalone-product"
  | "legacy-asset";

export type ProductLifecycleStage =
  | "discovery"
  | "validation"
  | "development"
  | "launch"
  | "growth"
  | "maturity"
  | "retirement";

export type IdeaLifecycleStage =
  | "captured"
  | "screening"
  | "research"
  | "prototype"
  | "validated"
  | "promoted"
  | "archived";

export interface GovernanceOwnerSet {
  businessOwner: string;
  technicalOwner: string;
  governanceOwner: string;
  approverIdentityIds: string[];
}

export interface GovernancePolicy {
  id: string;
  code: string;
  name: string;
  description: string;
  version: string;
  status: GovernanceStatus;
  scope: string[];
  rules: string[];
  owners: GovernanceOwnerSet;
  requiresHumanApproval: boolean;
  previousVersionId?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceStandard {
  id: string;
  code: string;
  name: string;
  description: string;
  version: string;
  status: GovernanceStatus;
  domain: string;
  requirements: string[];
  policyIds: string[];
  owners: GovernanceOwnerSet;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceAssessment {
  id: string;
  subjectId: string;
  subjectType: string;
  policyIds: string[];
  standardIds: string[];
  passed: boolean;
  score: number;
  findings: string[];
  assessedByIdentityId: string;
  assessedAt: string;
}

export interface EnterpriseRiskRecord {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  likelihood: number;
  impact: number;
  score: number;
  severity: GovernanceSeverity;
  ownerIdentityId: string;
  mitigationActions: string[];
  status: "open" | "mitigating" | "accepted" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface LifecycleRecord {
  id: string;
  assetId: string;
  assetType: LifecycleAssetType;
  stage: CapabilityLifecycleStage | ProductLifecycleStage | IdeaLifecycleStage;
  previousStage?: string;
  reason: string;
  changedByIdentityId: string;
  humanApprovalRequired: boolean;
  changedAt: string;
}

export interface GovernanceDecision {
  id: string;
  subjectId: string;
  decisionType: string;
  outcome: "approved" | "rejected" | "deferred" | "escalated";
  rationale: string[];
  policyIds: string[];
  riskIds: string[];
  decidedByIdentityId: string;
  requiresHumanApproval: boolean;
  correlationId: string;
  decidedAt: string;
}

export interface GovernanceAuditEvent {
  id: string;
  eventType: string;
  actorIdentityId: string;
  targetId: string;
  action: string;
  result: "success" | "failure" | "blocked";
  correlationId: string;
  metadata: Record<string, unknown>;
  occurredAt: string;
}
