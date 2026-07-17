export type KnowledgeClassification = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";
export type KnowledgeGovernanceDecision = "APPROVED" | "REJECTED" | "REVIEW_REQUIRED";

export interface KnowledgeGovernancePolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  minimumTrustScore: number;
  requiresHumanApproval: boolean;
  allowedClassifications: KnowledgeClassification[];
  createdAt: string;
}

export interface KnowledgeTrustAssessmentInput {
  knowledgeId: string;
  sourceReliability: number;
  contentQuality: number;
  provenanceCompleteness: number;
  reviewCoverage: number;
  classification?: KnowledgeClassification;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeTrustAssessment {
  id: string;
  knowledgeId: string;
  trustScore: number;
  classification: KnowledgeClassification;
  decision: KnowledgeGovernanceDecision;
  requiresHumanApproval: boolean;
  reasons: string[];
  metadata: Record<string, unknown>;
  assessedAt: string;
}

export interface KnowledgeApprovalInput {
  assessmentId: string;
  approved: boolean;
  approvedBy: string;
  reason?: string;
}

export interface KnowledgeApprovalRecord {
  id: string;
  assessmentId: string;
  approved: boolean;
  approvedBy: string;
  reason?: string;
  decidedAt: string;
}

export interface KnowledgeGovernanceStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-5";
  name: "Governance & Trust";
  status: "ready";
  governanceReady: boolean;
  trustScoringReady: boolean;
  provenanceReady: boolean;
  auditReady: boolean;
  humanFinalAuthority: true;
  policies: number;
  assessments: number;
  approvals: number;
  capabilities: string[];
  generatedAt: string;
}