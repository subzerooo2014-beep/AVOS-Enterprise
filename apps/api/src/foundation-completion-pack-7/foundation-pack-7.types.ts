export type DecisionStatus =
  | "proposed"
  | "evaluating"
  | "approved"
  | "rejected"
  | "executed"
  | "reversed"
  | "failed";

export type DecisionActorType =
  | "human"
  | "ai-agent"
  | "system"
  | "organization";

export type EvidenceType =
  | "data"
  | "rule"
  | "model-output"
  | "human-input"
  | "policy"
  | "document"
  | "event"
  | "calculation";

export type ProvenanceNodeType =
  | "data-asset"
  | "dataset"
  | "document"
  | "event"
  | "decision"
  | "model"
  | "agent"
  | "capability"
  | "human"
  | "organization";

export type ProvenanceRelationType =
  | "derived-from"
  | "produced-by"
  | "consumed-by"
  | "validated-by"
  | "approved-by"
  | "triggered-by"
  | "transformed-from"
  | "supersedes";

export type TrustLevel =
  | "untrusted"
  | "low"
  | "moderate"
  | "high"
  | "verified";

export type TrustAssessmentStatus =
  | "pending"
  | "completed"
  | "failed";

export type AuditOutcome =
  | "success"
  | "failure"
  | "blocked"
  | "warning";

export interface ExplainabilityFactor {
  id: string;
  label: string;
  category:
    | "input"
    | "rule"
    | "model"
    | "policy"
    | "human"
    | "risk"
    | "constraint";
  description: string;
  weight: number;
  contribution: number;
  sourceReferenceId?: string;
}

export interface DecisionRecord {
  id: string;
  decisionType: string;
  title: string;
  description: string;
  subjectId: string;
  correlationId: string;
  causationId?: string;
  actorId: string;
  actorType: DecisionActorType;
  status: DecisionStatus;
  requestedAction: string;
  selectedOption?: string;
  alternatives: string[];
  rationale: string;
  confidence: number;
  riskScore: number;
  trustScore?: number;
  policyIds: string[];
  evidenceIds: string[];
  provenanceNodeIds: string[];
  explainabilityFactors: ExplainabilityFactor[];
  requiresHumanApproval: boolean;
  humanApprovalId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  decidedAt?: string;
  executedAt?: string;
}

export interface DecisionTraceEdge {
  id: string;
  fromDecisionId: string;
  toDecisionId: string;
  relation:
    | "caused"
    | "influenced"
    | "approved"
    | "rejected"
    | "reversed"
    | "superseded"
    | "replayed";
  reason: string;
  createdAt: string;
}

export interface EvidenceRecord {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  sourceId: string;
  sourceType: string;
  contentHash: string;
  payload: Record<string, unknown>;
  reliabilityScore: number;
  verified: boolean;
  verifiedByIdentityId?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface ProvenanceNode {
  id: string;
  type: ProvenanceNodeType;
  label: string;
  sourceSystem: string;
  ownerIdentityId?: string;
  contentHash?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProvenanceEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  relation: ProvenanceRelationType;
  actorIdentityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface TrustPolicy {
  id: string;
  name: string;
  description: string;
  active: boolean;
  minimumEvidenceCount: number;
  minimumVerifiedEvidenceCount: number;
  minimumAverageEvidenceReliability: number;
  maximumRiskScore: number;
  requireProvenance: boolean;
  requireExplainability: boolean;
  requireHumanApprovalAboveRisk: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrustAssessment {
  id: string;
  subjectType: "decision" | "evidence" | "data-asset" | "agent";
  subjectId: string;
  policyId: string;
  status: TrustAssessmentStatus;
  score: number;
  level: TrustLevel;
  passed: boolean;
  reasons: string[];
  metrics: Record<string, number | boolean>;
  assessedByIdentityId: string;
  assessedAt: string;
}

export interface AuditRecord {
  id: string;
  correlationId: string;
  category:
    | "decision"
    | "evidence"
    | "provenance"
    | "trust"
    | "policy"
    | "replay";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: AuditOutcome;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  metadata: Record<string, unknown>;
  occurredAt: string;
}

export interface DecisionReplayResult {
  id: string;
  sourceDecisionId: string;
  replayDecisionId: string;
  correlationId: string;
  equivalentInputs: boolean;
  equivalentOutcome: boolean;
  originalTrustScore?: number;
  replayTrustScore?: number;
  differences: string[];
  replayedByIdentityId: string;
  replayedAt: string;
}
