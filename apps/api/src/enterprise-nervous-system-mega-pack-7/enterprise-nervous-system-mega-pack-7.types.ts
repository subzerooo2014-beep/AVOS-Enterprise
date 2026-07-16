export type NervousSystemCertificationStatus =
  | "pending"
  | "certified"
  | "conditional"
  | "revoked";

export type NervousSystemReleaseDecisionType =
  | "release-enterprise-nervous-system"
  | "conditional-release"
  | "hold-enterprise-nervous-system";

export interface NervousSystemPackRecord {
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

export interface NervousSystemValidationReport {
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

export interface NervousSystemManifest {
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

export interface NervousSystemEvidenceRecord {
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

export interface NervousSystemFinalCertification {
  id: string;
  validationReportId: string;
  manifestId: string;
  status: NervousSystemCertificationStatus;
  score: number;
  certifiedByIdentityId: string;
  approvedByIdentityId: string;
  reasons: string[];
  conditions: string[];
  correlationId: string;
  createdAt: string;
}

export interface NervousSystemFinalSmokeTest {
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

export interface NervousSystemReleaseDecision {
  id: string;
  decision: NervousSystemReleaseDecisionType;
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

export interface NervousSystemFinalHealthIndex {
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

export interface NervousSystemFinalAuditRecord {
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
