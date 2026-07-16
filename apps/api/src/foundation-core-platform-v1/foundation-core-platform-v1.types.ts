export type FoundationLifecycleStatus =
  | "CREATED"
  | "STARTING"
  | "RUNNING"
  | "DEGRADED"
  | "STOPPING"
  | "STOPPED"
  | "FAILED";

export type FoundationCapabilityStatus =
  | "PLANNED"
  | "ACTIVE"
  | "DEPRECATED"
  | "RETIRED";

export interface FoundationRuntimeStateV1 {
  systemId: string;
  status: FoundationLifecycleStatus;
  startedAt?: string;
  stoppedAt?: string;
  lastTransitionAt: string;
  version: string;
  metadata: Record<string, unknown>;
}

export interface FoundationModuleRecordV1 {
  id: string;
  name: string;
  version: string;
  status: "REGISTERED" | "ACTIVE" | "DEGRADED" | "DISABLED";
  dependencies: string[];
  capabilities: string[];
  lazy: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationPluginManifestV1 {
  id: string;
  name: string;
  version: string;
  compatiblePlatformRange: string;
  entryPoint: string;
  capabilities: string[];
  permissions: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationDependencyNodeV1 {
  moduleId: string;
  dependencies: string[];
  dependents: string[];
  circular: boolean;
}

export interface FoundationCapabilityRecordV1 {
  id: string;
  name: string;
  version: string;
  status: FoundationCapabilityStatus;
  ownerModuleId: string;
  dependencies: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoundationFeatureFlagV1 {
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
  environments: string[];
  metadata: Record<string, unknown>;
  updatedAt: string;
}

export interface FoundationCompatibilityResultV1 {
  compatible: boolean;
  currentVersion: string;
  requiredRange: string;
  reasons: string[];
}

export interface LivingArchitectureRecordV1 {
  id: string;
  type: "MODULE" | "CAPABILITY" | "PLUGIN" | "DEPENDENCY" | "DECISION";
  name: string;
  version: string;
  relationships: string[];
  metadata: Record<string, unknown>;
  updatedAt: string;
}

export interface PlatformHealthSnapshotV1 {
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  score: number;
  issues: string[];
  checkedAt: string;
  components: Record<string, string>;
}

export interface FoundationCoreMetricsV1 {
  modules: number;
  plugins: number;
  capabilities: number;
  featureFlags: number;
  architectureRecords: number;
  circularDependencies: number;
  enabledPlugins: number;
  activeCapabilities: number;
}

export interface FoundationCoreStatusV1 {
  success: boolean;
  system: string;
  version: string;
  runtime: FoundationRuntimeStateV1;
  metrics: FoundationCoreMetricsV1;
  health: PlatformHealthSnapshotV1;
}
