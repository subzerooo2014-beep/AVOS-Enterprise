export type TrustSubjectType =
  | "capability"
  | "agent"
  | "service"
  | "workflow"
  | "product"
  | "decision"
  | "data-asset";

export interface ExplainabilityRecord {
  id: string;
  decisionId: string;
  summary: string;
  rationale: string[];
  evidenceIds: string[];
  confidence: number;
  limitations: string[];
  createdAt: string;
}

export interface DecisionTraceRecord {
  id: string;
  decisionId: string;
  parentDecisionId?: string;
  childDecisionIds: string[];
  actorIdentityId: string;
  action: string;
  outcome: string;
  correlationId: string;
  createdAt: string;
}

export interface DataProvenanceRecord {
  id: string;
  assetId: string;
  sourceType: "internal" | "external" | "generated" | "human-provided";
  sourceName: string;
  sourceReference?: string;
  ownerIdentityId: string;
  trustLevel: number;
  transformations: string[];
  collectedAt: string;
  updatedAt: string;
}

export interface TrustScoreRecord {
  id: string;
  subjectId: string;
  subjectType: TrustSubjectType;
  score: number;
  reliability: number;
  transparency: number;
  provenanceQuality: number;
  compliance: number;
  humanOversight: number;
  reasons: string[];
  calculatedAt: string;
}

export type AuditSeverity = "info" | "warning" | "critical";

export interface TrustAuditEvent {
  id: string;
  eventType: string;
  actorIdentityId: string;
  targetId: string;
  action: string;
  result: "success" | "failure" | "blocked";
  severity: AuditSeverity;
  correlationId: string;
  metadata: Record<string, unknown>;
  occurredAt: string;
}

export type HumanApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "escalated"
  | "executed"
  | "expired";

export interface HumanApprovalRequest {
  id: string;
  subjectId: string;
  requestedByIdentityId: string;
  approverIdentityId?: string;
  reason: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  status: HumanApprovalStatus;
  decisionId?: string;
  createdAt: string;
  resolvedAt?: string;
}
