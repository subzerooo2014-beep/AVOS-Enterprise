export type KernelPluginStatus =
  | "registered"
  | "validated"
  | "installed"
  | "enabled"
  | "disabled"
  | "upgrading"
  | "rollback"
  | "failed"
  | "removed";

export type KernelPluginTrustLevel =
  | "untrusted"
  | "restricted"
  | "trusted"
  | "system";

export type KernelExtensionPointType =
  | "hook"
  | "provider"
  | "processor"
  | "validator"
  | "transformer"
  | "listener"
  | "command-handler"
  | "query-handler";

export interface KernelPluginManifest {
  id: string;
  name: string;
  description: string;
  version: string;
  publisher: string;
  entryModule: string;
  kernelVersionRange: string;
  dependencies: string[];
  optionalDependencies: string[];
  permissions: string[];
  capabilities: string[];
  extensionPoints: string[];
  trustLevel: KernelPluginTrustLevel;
  sandboxRequired: boolean;
  autoEnable: boolean;
  removable: boolean;
  metadata: Record<string, unknown>;
}

export interface KernelPluginRecord {
  id: string;
  manifest: KernelPluginManifest;
  status: KernelPluginStatus;
  installedVersion?: string;
  previousVersion?: string;
  enabledAt?: string;
  disabledAt?: string;
  installedAt?: string;
  removedAt?: string;
  failureReason?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelPluginCompatibilityAssessment {
  id: string;
  pluginId: string;
  compatible: boolean;
  kernelVersion: string;
  pluginVersion: string;
  dependencyFindings: string[];
  permissionFindings: string[];
  extensionPointFindings: string[];
  warnings: string[];
  assessedAt: string;
}

export interface KernelPluginPermissionGrant {
  id: string;
  pluginId: string;
  permission: string;
  granted: boolean;
  grantedByIdentityId?: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface KernelSandboxPolicy {
  id: string;
  pluginId: string;
  enabled: boolean;
  allowedOperations: string[];
  deniedOperations: string[];
  maxExecutionMilliseconds: number;
  maxMemoryMb: number;
  networkAccess: boolean;
  filesystemAccess: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelExtensionPoint {
  id: string;
  name: string;
  type: KernelExtensionPointType;
  contract: Record<string, unknown>;
  allowedPluginTrustLevels: KernelPluginTrustLevel[];
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelExtensionBinding {
  id: string;
  extensionPointId: string;
  pluginId: string;
  handlerName: string;
  priority: number;
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelServiceDescriptor {
  id: string;
  name: string;
  version: string;
  providerId: string;
  capabilityIds: string[];
  public: boolean;
  active: boolean;
  methods: Array<{
    name: string;
    description: string;
    requiresPermission?: string;
  }>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelCapabilityDescriptor {
  id: string;
  name: string;
  description: string;
  version: string;
  providerId: string;
  serviceIds: string[];
  extensionPointIds: string[];
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelSdkOperation {
  id: string;
  name: string;
  serviceId: string;
  methodName: string;
  requiresPermission?: string;
  available: boolean;
  metadata: Record<string, unknown>;
}

export interface KernelPluginLifecycleEvent {
  id: string;
  pluginId: string;
  action:
    | "register"
    | "validate"
    | "install"
    | "enable"
    | "disable"
    | "upgrade"
    | "rollback"
    | "remove"
    | "fail";
  fromStatus: KernelPluginStatus;
  toStatus: KernelPluginStatus;
  actorIdentityId: string;
  correlationId: string;
  reason: string;
  occurredAt: string;
}

export interface KernelPluginHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    registryScore: number;
    compatibilityScore: number;
    permissionScore: number;
    sandboxScore: number;
    extensionScore: number;
    serviceScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface KernelPluginAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "plugin"
    | "compatibility"
    | "permission"
    | "sandbox"
    | "extension"
    | "service"
    | "capability"
    | "sdk"
    | "lifecycle"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
