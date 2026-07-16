export type EnterpriseBrainCertificationStatus =
  | "pending"
  | "certified"
  | "conditional"
  | "revoked";

export type EnterpriseBrainReleaseDecisionType =
  | "release-enterprise-brain"
  | "conditional-release"
  | "hold-enterprise-brain";

export interface EnterpriseBrainPackRecord {
  id: string;
  packNumber: number;
  name: string;
  route: string;
  version: string;
  registered: boolean;
  verified: boolean;
  buildPassed: boolean;
  healthy: boolean;
  required: boolean;
  metadata: Record<string, unknown>;
}

export interface EnterpriseBrainValidationReport {
  id: string;
  success: boolean;
  score: number;
  packsChecked: number;
  checks: Record<string, boolean>;
  criticalFailures: string[];
  warnings: string[];
  correlationId: string;
  createdAt: string;
}

export interface EnterpriseBrainManifest {
  id: string;
  name: string;
  version: string;
  classification: string;
  packIds: string[];
  capabilities: string[];
  dependencies: string[];
  principles: Record<string, boolean>;
  validationReportId: string;
  status: "draft" | "ready" | "certified";
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseBrainEvidenceRecord {
  id: string;
  subjectId: string;
  category:
    | "pack"
    | "validation"
    | "manifest"
    | "certification"
    | "smoke"
    | "release"
    | "health";
  outcome: "passed" | "failed" | "warning";
  details: Record<string, unknown>;
  correlationId: string;
  createdByIdentityId: string;
  createdAt: string;
}

export interface EnterpriseBrainFinalCertification {
  id: string;
  validationReportId: string;
  manifestId: string;
  status: EnterpriseBrainCertificationStatus;
  score: number;
  certifiedByIdentityId: string;
  approvedByIdentityId: string;
  reasons: string[];
  conditions: string[];
  correlationId: string;
  createdAt: string;
}

export interface EnterpriseBrainFinalSmokeTest {
  id: string;
  stage: "started" | "completed" | "failed";
  passed: number;
  failed: number;
  score: number;
  runtimeReady: boolean;
  checks: Record<string, boolean>;
  correlationId: string;
  createdAt: string;
}

export interface EnterpriseBrainReleaseDecision {
  id: string;
  decision: EnterpriseBrainReleaseDecisionType;
  certificationId?: string;
  smokeTestId?: string;
  manifestId?: string;
  score: number;
  reasons: string[];
  conditions: string[];
  decidedByIdentityId: string;
  approvedByIdentityId: string;
  correlationId: string;
  createdAt: string;
}

export interface EnterpriseBrainFinalHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    registryScore: number;
    validationScore: number;
    manifestScore: number;
    evidenceScore: number;
    certificationScore: number;
    smokeScore: number;
    releaseScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface EnterpriseBrainFinalAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "registry"
    | "validation"
    | "manifest"
    | "evidence"
    | "certification"
    | "smoke"
    | "release"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
