export type DigitalDnaAssetType =
  | "capability"
  | "product"
  | "workflow"
  | "decision"
  | "agent"
  | "api"
  | "event"
  | "policy"
  | "service"
  | "integration"
  | "data"
  | "model"
  | "document"
  | "organization";

export type DigitalDnaStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export interface DigitalDnaIdentity {
  identityId: string;
  canonicalName: string;
  displayName: string;
  assetType: DigitalDnaAssetType;
  ownerIdentityId: string;
  organizationIdentityId?: string;
}

export interface DigitalDnaPurpose {
  mission: string;
  problemSolved: string;
  valueCreated: string[];
  intendedUsers: string[];
  strategicAlignment: string[];
}

export interface DigitalDnaContract {
  id: string;
  type: "api" | "event" | "workflow" | "data" | "policy" | "service";
  version: string;
  providerIdentityId: string;
  consumerIdentityIds: string[];
  guarantees: string[];
  constraints: string[];
}

export interface DigitalDnaDependency {
  assetId: string;
  relation:
    | "depends-on"
    | "provides-to"
    | "consumes"
    | "governed-by"
    | "owned-by"
    | "derived-from"
    | "extends"
    | "replaces";
  criticality: "low" | "medium" | "high" | "critical";
  required: boolean;
  versionConstraint?: string;
}

export interface DigitalDnaPolicyBinding {
  policyId: string;
  mandatory: boolean;
  enforcementMode:
    | "advisory"
    | "preventive"
    | "detective"
    | "human-approval";
}

export interface DigitalDnaPermission {
  principalIdentityId: string;
  actions: string[];
  conditions: Record<string, unknown>;
}

export interface DigitalDnaMetric {
  id: string;
  name: string;
  unit: string;
  target?: number;
  current?: number;
  higherIsBetter: boolean;
}

export interface DigitalDnaRecord {
  id: string;
  identity: DigitalDnaIdentity;
  purpose: DigitalDnaPurpose;
  contracts: DigitalDnaContract[];
  dependencies: DigitalDnaDependency[];
  policies: DigitalDnaPolicyBinding[];
  permissions: DigitalDnaPermission[];
  events: string[];
  metrics: DigitalDnaMetric[];
  version: string;
  status: DigitalDnaStatus;
  metadata: Record<string, unknown>;
  checksum: string;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalDnaHistoryRecord {
  id: string;
  dnaId: string;
  action: string;
  previousVersion?: string;
  nextVersion?: string;
  actorIdentityId: string;
  reason: string;
  snapshot: DigitalDnaRecord;
  occurredAt: string;
}

export interface DigitalDnaEvolutionRecord {
  id: string;
  dnaId: string;
  fromVersion: string;
  toVersion: string;
  changeSummary: string;
  changedSections: string[];
  compatibility:
    | "compatible"
    | "conditionally-compatible"
    | "breaking";
  approvedByIdentityId?: string;
  evolvedByIdentityId: string;
  evolvedAt: string;
}

export interface DigitalDnaValidationFinding {
  id: string;
  dnaId: string;
  severity: "info" | "warning" | "error" | "critical";
  code:
    | "identity-missing"
    | "purpose-incomplete"
    | "owner-missing"
    | "contract-invalid"
    | "dependency-invalid"
    | "policy-missing"
    | "permission-empty"
    | "metric-incomplete"
    | "checksum-mismatch"
    | "version-invalid";
  message: string;
  relatedIds: string[];
  createdAt: string;
}

export interface DigitalDnaHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    identityScore: number;
    purposeScore: number;
    contractScore: number;
    dependencyScore: number;
    governanceScore: number;
    observabilityScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface DigitalDnaAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "dna"
    | "history"
    | "evolution"
    | "validation"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
