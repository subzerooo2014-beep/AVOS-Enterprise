export type KernelDependencyType =
  | "required"
  | "optional"
  | "runtime"
  | "build"
  | "policy";

export type KernelCompatibilityStatus =
  | "compatible"
  | "conditionally-compatible"
  | "incompatible"
  | "unknown";

export type KernelConfigurationValueType =
  | "string"
  | "number"
  | "boolean"
  | "json"
  | "secret-reference";

export type KernelConfigurationStatus =
  | "active"
  | "deprecated"
  | "disabled";

export interface KernelDependencyNode {
  id: string;
  name: string;
  version: string;
  providerModule: string;
  capabilities: string[];
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelDependencyEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  dependencyType: KernelDependencyType;
  requiredVersion?: string;
  reason: string;
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface KernelDependencyResolution {
  id: string;
  requestedNodeIds: string[];
  activationOrder: string[];
  unresolvedDependencies: string[];
  optionalMissingDependencies: string[];
  cycles: string[][];
  resolvable: boolean;
  resolvedAt: string;
}

export interface KernelCompatibilityRule {
  id: string;
  subjectNodeId: string;
  subjectVersionRange: string;
  dependencyNodeId: string;
  dependencyVersionRange: string;
  status: KernelCompatibilityStatus;
  conditions: string[];
  rationale: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KernelCompatibilityAssessment {
  id: string;
  subjectNodeId: string;
  dependencyNodeId: string;
  subjectVersion: string;
  dependencyVersion: string;
  status: KernelCompatibilityStatus;
  matchedRuleIds: string[];
  conditions: string[];
  findings: string[];
  assessedAt: string;
}

export interface KernelConfigurationEntry {
  id: string;
  key: string;
  valueType: KernelConfigurationValueType;
  value: unknown;
  defaultValue?: unknown;
  environment: string;
  profileId: string;
  required: boolean;
  mutableAtRuntime: boolean;
  secret: boolean;
  status: KernelConfigurationStatus;
  validationRules: Array<{
    type:
      | "required"
      | "min"
      | "max"
      | "pattern"
      | "one-of"
      | "custom";
    value?: unknown;
    message: string;
  }>;
  metadata: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface KernelEnvironmentProfile {
  id: string;
  name: string;
  environment: string;
  description: string;
  parentProfileId?: string;
  configurationKeys: string[];
  locked: boolean;
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelConfigurationVersion {
  id: string;
  entryId: string;
  version: number;
  previousValue: unknown;
  nextValue: unknown;
  changedByIdentityId: string;
  correlationId: string;
  reason: string;
  createdAt: string;
}

export interface KernelConfigurationSnapshot {
  id: string;
  profileId: string;
  environment: string;
  entries: KernelConfigurationEntry[];
  createdByIdentityId: string;
  correlationId: string;
  reason: string;
  createdAt: string;
}

export interface KernelConfigurationValidationFinding {
  id: string;
  entryId: string;
  severity: "info" | "warning" | "error" | "critical";
  code:
    | "missing-required-value"
    | "invalid-type"
    | "below-minimum"
    | "above-maximum"
    | "pattern-mismatch"
    | "not-allowed"
    | "secret-value-exposed"
    | "invalid-profile"
    | "duplicate-key";
  message: string;
  createdAt: string;
}

export interface KernelDependencyConfigurationReadiness {
  id: string;
  ready: boolean;
  score: number;
  blockers: string[];
  warnings: string[];
  dependencyScore: number;
  compatibilityScore: number;
  configurationScore: number;
  assessedAt: string;
}

export interface KernelDependencyConfigurationHealth {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    dependencyIntegrityScore: number;
    compatibilityScore: number;
    configurationValidityScore: number;
    profileCoverageScore: number;
    rollbackReadinessScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface KernelDependencyConfigurationAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "dependency"
    | "compatibility"
    | "configuration"
    | "profile"
    | "version"
    | "validation"
    | "readiness"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
