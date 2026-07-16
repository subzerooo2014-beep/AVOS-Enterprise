export type FoundationPackStatus =
  | "registered"
  | "verified"
  | "failed"
  | "degraded"
  | "unknown";

export type FoundationCertificationStatus =
  | "draft"
  | "pending"
  | "certified"
  | "conditionally-certified"
  | "rejected"
  | "revoked";

export interface FoundationPackDescriptor {
  id: string;
  packNumber: number;
  name: string;
  capability: string;
  version: string;
  route: string;
  moduleName: string;
  required: boolean;
  dependencies: string[];
  status: FoundationPackStatus;
  verificationPassed: boolean;
  buildPassed: boolean;
  healthStatus: "healthy" | "degraded" | "critical" | "unknown";
  metadata: Record<string, unknown>;
  updatedAt: string;
}

export interface CrossFoundationValidationCheck {
  id: string;
  category:
    | "registration"
    | "dependency"
    | "version"
    | "route"
    | "module"
    | "verification"
    | "build"
    | "health"
    | "principle"
    | "readiness";
  name: string;
  description: string;
  required: boolean;
  passed: boolean;
  score: number;
  relatedPackIds: string[];
  findings: string[];
  checkedAt: string;
}

export interface CrossFoundationValidationReport {
  id: string;
  success: boolean;
  score: number;
  checks: CrossFoundationValidationCheck[];
  criticalFailures: string[];
  warnings: string[];
  validatedPackIds: string[];
  validatedAt: string;
}

export interface FoundationCertification {
  id: string;
  name: string;
  version: string;
  status: FoundationCertificationStatus;
  validationReportId: string;
  certifiedPackIds: string[];
  score: number;
  conditions: string[];
  restrictions: string[];
  certifiedByIdentityId: string;
  approvedByIdentityId?: string;
  issuedAt: string;
  expiresAt?: string;
}

export interface FoundationManifest {
  id: string;
  name: string;
  releaseVersion: string;
  foundationVersion: string;
  packIds: string[];
  capabilities: string[];
  routes: string[];
  modules: string[];
  principles: Record<string, boolean>;
  readiness: {
    score: number;
    ready: boolean;
    blockers: string[];
  };
  checksum: string;
  generatedByIdentityId: string;
  generatedAt: string;
}

export interface FoundationEvidenceRecord {
  id: string;
  category:
    | "type-check"
    | "build"
    | "verification"
    | "health"
    | "cross-validation"
    | "certification"
    | "manifest"
    | "smoke-test";
  subjectId: string;
  outcome: "passed" | "failed" | "warning";
  details: Record<string, unknown>;
  checksum: string;
  createdAt: string;
}

export interface FoundationSmokeTestResult {
  id: string;
  stage: "started" | "completed" | "failed";
  tests: Array<{
    id: string;
    name: string;
    passed: boolean;
    details: string[];
  }>;
  passed: number;
  failed: number;
  score: number;
  runtimeReady: boolean;
  testedAt: string;
}

export interface FoundationReleaseDecision {
  id: string;
  decision:
    | "release-foundation"
    | "conditional-release"
    | "hold-foundation"
    | "reject-foundation";
  certificationId?: string;
  manifestId?: string;
  evidenceIds: string[];
  rationale: string[];
  conditions: string[];
  approvedByIdentityId?: string;
  decidedByIdentityId: string;
  decidedAt: string;
}

export interface FoundationFinalHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    packCoverageScore: number;
    verificationScore: number;
    dependencyScore: number;
    certificationScore: number;
    evidenceScore: number;
    smokeTestScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface FoundationFinalAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "registry"
    | "validation"
    | "certification"
    | "manifest"
    | "evidence"
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
