export type ClosureStatus =
  | "draft"
  | "validating"
  | "completed"
  | "failed"
  | "revoked";

export type ValidationStatus =
  | "pending"
  | "passed"
  | "failed"
  | "warning";

export type TransitionStatus =
  | "draft"
  | "ready"
  | "accepted"
  | "rejected";

export interface MegaPackValidation {
  id: string;
  packNumber: number;
  packName: string;
  version: string;
  buildPassed: boolean;
  verificationPassed: boolean;
  healthStatus: "healthy" | "degraded" | "critical";
  evidenceChainVerified: boolean;
  status: ValidationStatus;
  message: string;
  validatedAt: string;
}

export interface CrossPackConsistencyCheck {
  id: string;
  name: string;
  category:
    | "integrity"
    | "versioning"
    | "health"
    | "evidence"
    | "certification"
    | "runtime"
    | "governance";
  required: boolean;
  status: ValidationStatus;
  score: number;
  message: string;
  evaluatedAt: string;
}

export interface V7ImmutableBaseline {
  id: string;
  baselineName: string;
  version: string;
  status: "created" | "sealed" | "verified" | "invalid";
  megaPackCount: number;
  includedMegaPacks: number[];
  sourceHashes: Record<string, string>;
  consolidatedHash: string;
  previousBaselineHash: string;
  createdAt: string;
  sealedAt?: string;
  verifiedAt?: string;
}

export interface V7CompletionCertificate {
  id: string;
  certificateNumber: string;
  systemName: string;
  version: string;
  status: "issued" | "verified" | "revoked";
  completionScore: number;
  enterpriseReady: boolean;
  productionCertified: boolean;
  evidenceChainVerified: boolean;
  issuedAt: string;
  expiresAt?: string;
  integrityHash: string;
}

export interface ExecutiveCompletionReport {
  id: string;
  title: string;
  version: string;
  overallStatus: "complete" | "incomplete";
  completionScore: number;
  completedMegaPacks: number;
  totalMegaPacks: number;
  healthyMegaPacks: number;
  failedMegaPacks: number;
  enterpriseReady: boolean;
  productionCertified: boolean;
  recommendations: string[];
  generatedAt: string;
}

export interface V8TransitionPackage {
  id: string;
  name: string;
  fromVersion: string;
  targetVersion: string;
  status: TransitionStatus;
  baselineId: string;
  certificateId: string;
  requiredCapabilities: string[];
  architecturalPrinciples: string[];
  protectedAssets: string[];
  createdAt: string;
  acceptedAt?: string;
}

export interface V7ClosureRecord {
  id: string;
  version: string;
  status: ClosureStatus;
  validationIds: string[];
  consistencyCheckIds: string[];
  baselineId?: string;
  certificateId?: string;
  executiveReportId?: string;
  transitionPackageId?: string;
  finalScore: number;
  blockers: string[];
  warnings: string[];
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
}

export interface ClosureEvidenceEntry {
  id: string;
  sequence: number;
  eventType: string;
  entityType: string;
  entityId: string;
  actor: string;
  timestamp: string;
  payload: Record<string, unknown>;
  previousHash: string;
  hash: string;
}

export interface ClosurePlatformEvent {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface V7ClosureSnapshot {
  generatedAt: string;
  healthStatus: "healthy" | "degraded" | "critical";
  evidenceChainVerified: boolean;
  closureRecords: number;
  completedClosures: number;
  failedClosures: number;
  megaPackValidations: number;
  passedMegaPackValidations: number;
  failedMegaPackValidations: number;
  consistencyChecks: number;
  passedConsistencyChecks: number;
  failedConsistencyChecks: number;
  immutableBaselines: number;
  sealedBaselines: number;
  verifiedBaselines: number;
  completionCertificates: number;
  verifiedCertificates: number;
  executiveReports: number;
  transitionPackages: number;
  readyTransitionPackages: number;
  acceptedTransitionPackages: number;
  evidenceEntries: number;
  platformEvents: number;
}
