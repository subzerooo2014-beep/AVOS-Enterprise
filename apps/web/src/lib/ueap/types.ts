export type RuntimeHealth = "healthy" | "degraded" | "unhealthy";

export interface RuntimeApplication {
  id: string;
  name: string;
  route: string;
  category: string;
  version: string;
  health: RuntimeHealth;
  enabled: boolean;
  permissions: string[];
  tenantAware: boolean;
  pluginCount: number;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  region: string;
  plan: string;
  status: "active" | "suspended" | "provisioning";
}

export interface Workspace {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  status: string;
}

export interface RuntimeNotification {
  id: string;
  title: string;
  message: string;
  priority: "low" | "normal" | "high" | "critical";
  read: boolean;
  createdAt: string;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  scope: "global" | "tenant" | "role" | "user";
  rolloutPercentage: number;
}

export interface RuntimeSnapshot {
  status: string;
  version: string;
  healthScore: number;
  applications: number;
  tenants: number;
  workspaces: number;
  plugins: number;
  notifications: number;
  foundationFirst: boolean;
  capabilityFirst: boolean;
  humanFinalAuthority: boolean;
  globalComplianceReadinessGate: boolean;
}
