export type RuntimeStatus = "IDLE" | "RUNNING" | "PAUSED" | "FAILED" | "COMPLETED";

export interface RuntimeJob {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  status: RuntimeStatus;
  priority: number;
  attempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenantRuntimeConfig {
  tenantId: string;
  enabled: boolean;
  featureFlags: Record<string, boolean>;
  settings: Record<string, unknown>;
  updatedAt: string;
}
