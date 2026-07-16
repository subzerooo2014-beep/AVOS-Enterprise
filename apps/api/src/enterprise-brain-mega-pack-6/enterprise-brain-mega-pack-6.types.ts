export type BrainExplanationType =
  | "decision"
  | "reasoning"
  | "recommendation"
  | "prediction"
  | "plan"
  | "agent";

export type BrainTraceEventType =
  | "created"
  | "context-loaded"
  | "evidence-added"
  | "reasoning-started"
  | "option-scored"
  | "risk-assessed"
  | "approval-requested"
  | "approved"
  | "rejected"
  | "completed"
  | "failed";

export type BrainTrustLevel =
  | "untrusted"
  | "low"
  | "moderate"
  | "high"
  | "verified";

export type BrainApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "cancelled";

export interface BrainExplanation {
  id: string;
  subjectId: string;
  type: BrainExplanationType;
  summary: string;
  rationale: string[];
  evidenceIds: string[];
  assumptions: string[];
  alternatives: string[];
  limitations: string[];
  confidence: number;
  riskScore: number;
  modelOrEngine: string;
  generatedByIdentityId: string;
  correlationId: string;
  createdAt: string;
}

export interface BrainDecisionTraceEvent {
  id: string;
  traceId: string;
  subjectId: string;
  eventType: BrainTraceEventType;
  sequence: number;
  actorIdentityId: string;
  input?: unknown;
  output?: unknown;
  metadata: Record<string, unknown>;
  occurredAt: string;
}

export interface BrainDecisionTrace {
  id: string;
  subjectId: string;
  correlationId: string;
  events: BrainDecisionTraceEvent[];
  status: "open" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
}

export interface BrainTrustScore {
  id: string;
  subjectId: string;
  score: number;
  level: BrainTrustLevel;
  dimensions: {
    evidenceQuality: number;
    traceCompleteness: number;
    confidenceQuality: number;
    riskControl: number;
    approvalIntegrity: number;
    provenanceQuality: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface BrainEvidenceRecord {
  id: string;
  subjectId: string;
  category:
    | "decision"
    | "reasoning"
    | "prediction"
    | "recommendation"
    | "plan"
    | "agent"
    | "approval"
    | "diagnostic";
  sourceType: string;
  sourceId: string;
  content: unknown;
  hash: string;
  provenance: {
    origin: string;
    capturedByIdentityId: string;
    capturedAt: string;
  };
  confidence: number;
  verified: boolean;
  verifiedByIdentityId?: string;
  createdAt: string;
}

export interface BrainApprovalRequest {
  id: string;
  subjectId: string;
  action: string;
  reason: string;
  riskScore: number;
  requestedByIdentityId: string;
  requiredApproverRole: string;
  status: BrainApprovalStatus;
  approvedByIdentityId?: string;
  rejectedByIdentityId?: string;
  decisionNote?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrainDiagnosticFinding {
  id: string;
  category:
    | "reasoning"
    | "memory"
    | "knowledge"
    | "planning"
    | "learning"
    | "agent"
    | "trust"
    | "governance";
  severity: "info" | "warning" | "error" | "critical";
  title: string;
  description: string;
  subjectId: string;
  evidenceIds: string[];
  recommendations: string[];
  autoRecoverable: boolean;
  resolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

export interface BrainGovernanceAssessment {
  id: string;
  subjectId: string;
  score: number;
  allowed: boolean;
  checks: Record<string, boolean>;
  failedChecks: string[];
  conditions: string[];
  assessedByIdentityId: string;
  correlationId: string;
  createdAt: string;
}

export interface BrainTrustDiagnosticsHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    explainabilityScore: number;
    traceabilityScore: number;
    trustScore: number;
    evidenceScore: number;
    approvalScore: number;
    diagnosticsScore: number;
    governanceScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface BrainTrustAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "explainability"
    | "traceability"
    | "trust"
    | "evidence"
    | "approval"
    | "diagnostics"
    | "governance"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
