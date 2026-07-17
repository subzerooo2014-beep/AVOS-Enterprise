export type PlatformEnvironmentKind =
  | "development"
  | "testing"
  | "staging"
  | "production";

export type PlatformResourceKind =
  | "platform"
  | "product"
  | "application"
  | "service"
  | "engine"
  | "capability"
  | "workflow"
  | "integration";

export type PlatformResourceStatus =
  | "registered"
  | "starting"
  | "running"
  | "degraded"
  | "stopped"
  | "failed"
  | "maintenance";

export interface PlatformEnvironment {
  readonly id: string;
  readonly name: string;
  readonly kind: PlatformEnvironmentKind;
  readonly region: string;
  readonly isDefault: boolean;
  readonly status: "active" | "frozen" | "retired";
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PlatformResource {
  readonly id: string;
  readonly name: string;
  readonly kind: PlatformResourceKind;
  readonly version: string;
  readonly environmentId: string;
  readonly status: PlatformResourceStatus;
  readonly owner: string;
  readonly dependencies: readonly string[];
  readonly endpoints: readonly string[];
  readonly tags: readonly string[];
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly registeredAt: string;
  readonly updatedAt: string;
}

export interface PlatformConfiguration {
  readonly id: string;
  readonly namespace: string;
  readonly key: string;
  readonly value: unknown;
  readonly environmentId: string;
  readonly sensitive: boolean;
  readonly version: number;
  readonly description?: string;
  readonly updatedBy: string;
  readonly updatedAt: string;
}

export interface PlatformAuditRecord {
  readonly id: string;
  readonly action: string;
  readonly actorId: string;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly environmentId?: string;
  readonly outcome: "success" | "rejected" | "failed";
  readonly details: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
}

export interface PlatformHealth {
  readonly system: "AVOS Platform Control Plane";
  readonly status: "healthy" | "degraded" | "critical";
  readonly score: number;
  readonly environments: number;
  readonly resources: number;
  readonly runningResources: number;
  readonly degradedResources: number;
  readonly failedResources: number;
  readonly configurationEntries: number;
  readonly generatedAt: string;
}