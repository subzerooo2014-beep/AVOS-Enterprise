export type ConfigurationEnvironment =
  | "development"
  | "staging"
  | "production";

export type ConfigurationValue =
  | string
  | number
  | boolean
  | null
  | Record<string, unknown>
  | unknown[];

export type ConfigurationStatus =
  | "draft"
  | "pending_approval"
  | "active"
  | "rejected"
  | "rolled_back"
  | "disabled";

export type ApprovalDecision =
  | "approved"
  | "rejected";

export type PolicySeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type PolicyEvaluationResult =
  | "passed"
  | "warning"
  | "blocked";

export type DriftStatus =
  | "compliant"
  | "drifted"
  | "critical_drift";

export type FeatureFlagStrategy =
  | "all"
  | "percentage"
  | "environment"
  | "service"
  | "manual";

export type KillSwitchStatus =
  | "armed"
  | "activated"
  | "released";

export interface ConfigurationEntry {
  id: string;
  key: string;
  service: string;
  environment: ConfigurationEnvironment;
  value: ConfigurationValue;
  previousValue: ConfigurationValue;
  version: number;
  status: ConfigurationStatus;
  sensitive: boolean;
  description: string | null;
  requestedBy: string;
  approvedBy: string | null;
  approvalReason: string | null;
  createdAt: string;
  updatedAt: string;
  activatedAt: string | null;
}

export interface ConfigurationBaseline {
  id: string;
  name: string;
  service: string;
  environment: ConfigurationEnvironment;
  configuration: Record<string, ConfigurationValue>;
  version: number;
  active: boolean;
  checksum: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigurationPolicy {
  id: string;
  code: string;
  name: string;
  description: string;
  service: string | null;
  environment: ConfigurationEnvironment | null;
  keyPattern: string;
  severity: PolicySeverity;
  required: boolean;
  immutableInProduction: boolean;
  allowedTypes: string[];
  minimumNumber: number | null;
  maximumNumber: number | null;
  allowedValues: ConfigurationValue[];
  blockedValues: ConfigurationValue[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyEvaluation {
  id: string;
  configurationId: string | null;
  key: string;
  service: string;
  environment: ConfigurationEnvironment;
  result: PolicyEvaluationResult;
  score: number;
  violations: string[];
  warnings: string[];
  passedChecks: string[];
  evaluatedAt: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  service: string;
  environment: ConfigurationEnvironment;
  enabled: boolean;
  strategy: FeatureFlagStrategy;
  rolloutPercentage: number;
  targetServices: string[];
  targetUsers: string[];
  metadata: Record<string, unknown>;
  version: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigurationDrift {
  id: string;
  baselineId: string;
  service: string;
  environment: ConfigurationEnvironment;
  status: DriftStatus;
  missingKeys: string[];
  unexpectedKeys: string[];
  changedKeys: string[];
  compliancePercentage: number;
  detectedAt: string;
}

export interface ConfigurationApproval {
  id: string;
  configurationId: string;
  decision: ApprovalDecision;
  approver: string;
  reason: string;
  createdAt: string;
}

export interface KillSwitch {
  id: string;
  code: string;
  name: string;
  service: string;
  environment: ConfigurationEnvironment;
  status: KillSwitchStatus;
  reason: string | null;
  activatedBy: string | null;
  activatedAt: string | null;
  releasedBy: string | null;
  releasedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigurationRollback {
  id: string;
  configurationId: string;
  key: string;
  service: string;
  environment: ConfigurationEnvironment;
  fromVersion: number;
  toVersion: number;
  reason: string;
  automatic: boolean;
  createdAt: string;
}

export interface ConfigurationEvidence {
  id: string;
  evidenceType: string;
  entityType: string;
  entityId: string;
  payloadHash: string;
  previousHash: string | null;
  chainHash: string;
  createdAt: string;
}

export interface ConfigurationEvent {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string | null;
  severity: "info" | "warning" | "critical";
  message: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface ConfigurationGovernanceState {
  version: string;
  initializedAt: string;
  updatedAt: string;

  configurations: ConfigurationEntry[];
  baselines: ConfigurationBaseline[];
  policies: ConfigurationPolicy[];
  evaluations: PolicyEvaluation[];
  featureFlags: FeatureFlag[];
  drifts: ConfigurationDrift[];
  approvals: ConfigurationApproval[];
  killSwitches: KillSwitch[];
  rollbacks: ConfigurationRollback[];
  evidence: ConfigurationEvidence[];
  events: ConfigurationEvent[];
}

export interface ConfigurationGovernanceStatus {
  success: true;
  system: string;
  version: string;
  healthStatus: "healthy" | "degraded" | "critical";
  evidenceChainVerified: boolean;

  configurations: number;
  activeConfigurations: number;
  pendingApprovals: number;
  rejectedConfigurations: number;
  rolledBackConfigurations: number;

  policies: number;
  activePolicies: number;
  policyEvaluations: number;
  blockedEvaluations: number;

  baselines: number;
  activeBaselines: number;
  driftScans: number;
  criticalDrifts: number;

  featureFlags: number;
  enabledFeatureFlags: number;

  killSwitches: number;
  activatedKillSwitches: number;

  approvals: number;
  rollbacks: number;
  evidenceEntries: number;
  platformEvents: number;

  updatedAt: string;
}
