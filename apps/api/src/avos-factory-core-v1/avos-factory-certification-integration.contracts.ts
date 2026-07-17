export type AvosFactoryCertificateStatus =
  | "eligible"
  | "certified"
  | "rejected"
  | "revoked"
  | "expired";

export interface AvosFactoryCertificationCriterion {
  id: string;
  name: string;
  category:
    | "quality"
    | "validation"
    | "security"
    | "governance"
    | "operability"
    | "documentation";
  description: string;
  minimumScore: number;
  required: boolean;
  createdAt: string;
}

export interface AvosFactoryCertificationEvidence {
  criterionId: string;
  category: AvosFactoryCertificationCriterion["category"];
  score: number;
  minimumScore: number;
  passed: boolean;
  notes: string[];
}

export interface AvosFactoryCertificationAssessment {
  id: string;
  subjectId: string;
  actor: string;
  score: number;
  status: "eligible" | "rejected";
  evidence: AvosFactoryCertificationEvidence[];
  blockingCriteria: string[];
  releaseReadinessId?: string;
  generatedAt: string;
}

export interface AvosFactoryCertificate {
  id: string;
  subjectId: string;
  assessmentId: string;
  version: string;
  status: AvosFactoryCertificateStatus;
  score: number;
  issuedBy: string;
  approvedBy: string;
  humanApproved: boolean;
  issuedAt: string;
  expiresAt?: string;
  revokedAt?: string;
  revocationReason?: string;
}

export interface AvosFactoryReleaseGovernanceDecision {
  id: string;
  subjectId: string;
  certificateId: string;
  releaseReadinessId?: string;
  version: string;
  decision: "approved" | "rejected";
  actor: string;
  approvedBy: string;
  humanApproved: boolean;
  reason: string;
  decidedAt: string;
}

export interface AvosFactoryCertificationIntegrationSmokeReport {
  id: string;
  success: boolean;
  score: number;
  checks: Record<string, boolean>;
  blockingFindings: string[];
  generatedAt: string;
}
