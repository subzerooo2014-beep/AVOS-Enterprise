export type BlueprintStatus =
  | "draft"
  | "active"
  | "superseded"
  | "retired";

export type ArchitectureAssetType =
  | "module"
  | "service"
  | "controller"
  | "capability"
  | "workflow"
  | "event"
  | "contract"
  | "policy"
  | "data-asset"
  | "integration"
  | "agent"
  | "model";

export type ArchitectureRuleSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export type ArchitectureRuleStatus =
  | "active"
  | "disabled"
  | "retired";

export type DriftSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type CompatibilityStatus =
  | "compatible"
  | "conditionally-compatible"
  | "incompatible"
  | "unknown";

export interface LivingBlueprintAsset {
  id: string;
  identityId?: string;
  type: ArchitectureAssetType;
  name: string;
  version: string;
  path?: string;
  purpose: string;
  dependencies: string[];
  contracts: string[];
  policies: string[];
  metadata: Record<string, unknown>;
  active: boolean;
}

export interface LivingBlueprint {
  id: string;
  name: string;
  description: string;
  version: string;
  status: BlueprintStatus;
  architectureDomain: string;
  ownerIdentityId: string;
  sourceOfTruth: boolean;
  assets: LivingBlueprintAsset[];
  tags: string[];
  checksum: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlueprintVersionRecord {
  id: string;
  blueprintId: string;
  version: string;
  previousVersion?: string;
  snapshot: LivingBlueprint;
  changeSummary: string;
  changedByIdentityId: string;
  createdAt: string;
}

export interface BlueprintDiffEntry {
  path: string;
  changeType: "added" | "removed" | "modified";
  before?: unknown;
  after?: unknown;
}

export interface BlueprintDiffResult {
  id: string;
  blueprintId: string;
  fromVersion: string;
  toVersion: string;
  entries: BlueprintDiffEntry[];
  breakingChanges: string[];
  createdAt: string;
}

export interface RuntimeArchitectureSnapshot {
  id: string;
  environment: string;
  capturedByIdentityId: string;
  assets: LivingBlueprintAsset[];
  checksum: string;
  metadata: Record<string, unknown>;
  capturedAt: string;
}

export interface ArchitectureDriftFinding {
  id: string;
  blueprintId: string;
  runtimeSnapshotId: string;
  assetId: string;
  severity: DriftSeverity;
  driftType:
    | "missing-at-runtime"
    | "unexpected-at-runtime"
    | "version-mismatch"
    | "dependency-mismatch"
    | "contract-mismatch"
    | "metadata-mismatch";
  message: string;
  expected?: unknown;
  actual?: unknown;
  createdAt: string;
}

export interface ArchitectureRule {
  id: string;
  name: string;
  description: string;
  status: ArchitectureRuleStatus;
  severity: ArchitectureRuleSeverity;
  assetTypes: ArchitectureAssetType[];
  field: string;
  operator:
    | "exists"
    | "not-exists"
    | "equals"
    | "not-equals"
    | "contains"
    | "not-contains"
    | "minimum-count"
    | "maximum-count";
  value?: unknown;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureRuleFinding {
  id: string;
  ruleId: string;
  blueprintId: string;
  assetId: string;
  severity: ArchitectureRuleSeverity;
  message: string;
  createdAt: string;
}

export interface CompatibilityAssessment {
  id: string;
  blueprintId: string;
  sourceVersion: string;
  targetVersion: string;
  status: CompatibilityStatus;
  reasons: string[];
  breakingChanges: string[];
  assessedByIdentityId: string;
  assessedAt: string;
}

export interface DependencyHealthFinding {
  id: string;
  blueprintId: string;
  assetId: string;
  severity: ArchitectureRuleSeverity;
  code:
    | "missing-dependency"
    | "inactive-dependency"
    | "circular-dependency"
    | "orphan-asset"
    | "high-fan-in"
    | "high-fan-out";
  message: string;
  relatedAssetIds: string[];
  createdAt: string;
}

export interface ArchitectureImpactResult {
  id: string;
  blueprintId: string;
  changedAssetIds: string[];
  impactedAssetIds: string[];
  criticalAssetIds: string[];
  breakingRisk: boolean;
  reasons: string[];
  calculatedAt: string;
}

export interface ArchitectureRecommendation {
  id: string;
  blueprintId: string;
  category:
    | "drift"
    | "dependency"
    | "compatibility"
    | "quality"
    | "governance"
    | "resilience";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  relatedAssetIds: string[];
  rationale: string[];
  status: "open" | "accepted" | "dismissed" | "implemented";
  createdAt: string;
  updatedAt: string;
}

export interface FoundationHealthIndex {
  id: string;
  blueprintId: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    driftScore: number;
    ruleComplianceScore: number;
    dependencyHealthScore: number;
    compatibilityScore: number;
    metadataCompletenessScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface ArchitectureAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "blueprint"
    | "version"
    | "diff"
    | "runtime"
    | "drift"
    | "rule"
    | "compatibility"
    | "dependency-health"
    | "impact"
    | "recommendation"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
