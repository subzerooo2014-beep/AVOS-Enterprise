
export type KnowledgeGovernanceDecision = "ALLOW" | "REVIEW" | "DENY";
export type KnowledgeLifecycleState = "DRAFT" | "REVIEW" | "APPROVED" | "ACTIVE" | "DEPRECATED" | "ARCHIVED";
export type KnowledgeRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface KnowledgeGovernanceSubject {
  knowledgeId: string;
  namespace: string;
  ownerId?: string;
  classification?: string;
  lifecycleState?: KnowledgeLifecycleState;
  trustScore?: number;
  confidenceScore?: number;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeGovernanceContext {
  actorId: string;
  actorRoles?: string[];
  action: string;
  correlationId?: string;
  reason?: string;
  now?: string;
  metadata?: Record<string, unknown>;
}

export interface KnowledgePolicyRule {
  id: string;
  name: string;
  description?: string;
  namespace?: string;
  actions: string[];
  requiredRoles?: string[];
  minimumTrustScore?: number;
  allowedClassifications?: string[];
  decision: KnowledgeGovernanceDecision;
  priority: number;
  enabled: boolean;
}

export interface KnowledgePolicyEvaluation {
  decision: KnowledgeGovernanceDecision;
  matchedRules: string[];
  reasons: string[];
  evaluatedAt: string;
}

export interface KnowledgeQualityAssessment {
  knowledgeId: string;
  completeness: number;
  freshness: number;
  consistency: number;
  provenance: number;
  trust: number;
  overallScore: number;
  findings: string[];
  assessedAt: string;
}

export interface KnowledgeApprovalRecord {
  id: string;
  knowledgeId: string;
  requestedBy: string;
  approverId?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  reason?: string;
  createdAt: string;
  decidedAt?: string;
}

export interface KnowledgeAuditEntry {
  id: string;
  knowledgeId: string;
  actorId: string;
  action: string;
  decision?: KnowledgeGovernanceDecision;
  correlationId?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface KnowledgeRetentionPolicy {
  id: string;
  namespace?: string;
  classification?: string;
  retentionDays: number;
  archiveAfterDays?: number;
  legalHold: boolean;
  enabled: boolean;
}

export interface KnowledgeComplianceFinding {
  id: string;
  knowledgeId: string;
  control: string;
  compliant: boolean;
  riskLevel: KnowledgeRiskLevel;
  message: string;
  checkedAt: string;
}

export interface KnowledgeGovernanceResult {
  decision: KnowledgeGovernanceDecision;
  policy: KnowledgePolicyEvaluation;
  quality: KnowledgeQualityAssessment;
  compliance: KnowledgeComplianceFinding[];
  requiresApproval: boolean;
  approval?: KnowledgeApprovalRecord;
  auditId: string;
}