export type PlatformServiceType =
  | "NOTIFICATION"
  | "SCHEDULER"
  | "SEARCH"
  | "REPORTING"
  | "FILES"
  | "MEDIA"
  | "CONFIGURATION"
  | "FEATURE_FLAG"
  | "TENANT"
  | "MONITORING"
  | "UNKNOWN";

export interface PlatformServiceRecord {
  id: string;
  name: string;
  type: PlatformServiceType;
  filePath: string;
  domain: string;
  version: string;
  capabilities: string[];
  dependencies: string[];
  status: "DISCOVERED" | "ACTIVE";
  discoveredAt: string;
}

export interface NotificationRecord {
  id: string;
  channel: "EMAIL" | "SMS" | "PUSH" | "IN_APP";
  recipient: string;
  subject?: string;
  body: string;
  status: "QUEUED" | "SENT" | "FAILED";
  createdAt: string;
  sentAt?: string;
  error?: string;
}

export interface ScheduledTaskRecord {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  payload: Record<string, unknown>;
  lastRunAt?: string;
  nextRunAt?: string;
}

export interface FeatureFlagRecord {
  key: string;
  enabled: boolean;
  scope: "GLOBAL" | "TENANT" | "USER";
  scopeId?: string;
  version: number;
  updatedAt: string;
}

export interface ConfigurationRecord {
  key: string;
  value: unknown;
  scope: "GLOBAL" | "TENANT" | "USER";
  scopeId?: string;
  version: number;
  updatedAt: string;
}

export interface TenantContextRecord {
  tenantId: string;
  organizationId?: string;
  region?: string;
  locale?: string;
  metadata: Record<string, unknown>;
}

export interface PlatformServicesMetrics {
  components: number;
  notifications: number;
  sentNotifications: number;
  failedNotifications: number;
  scheduledTasks: number;
  featureFlags: number;
  configurations: number;
  tenants: number;
}

export interface PlatformServicesHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: PlatformServicesMetrics;
  components: Record<string, string>;
}
