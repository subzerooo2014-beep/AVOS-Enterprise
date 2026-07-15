export type GlobalPlatformCapability =
  | "TENANT_FEDERATION"
  | "MASTER_DATA_HUB"
  | "CUSTOMER_360"
  | "ASSET_REGISTRY"
  | "IDENTITY_ACCESS"
  | "WORKFLOW_HUB"
  | "AI_ORCHESTRATOR"
  | "NOTIFICATION_CENTER"
  | "DOCUMENT_CENTER"
  | "SEARCH_ENGINE"
  | "ANALYTICS_BI"
  | "AUDIT_COMPLIANCE"
  | "CROSS_INDUSTRY_REPORTING"
  | "INTEGRATION_HUB"
  | "PUBLIC_API_GATEWAY"
  | "EVENT_STREAMING"
  | "ENTERPRISE_SCHEDULER"
  | "AUTOMATION_CENTER"
  | "CONFIGURATION_CENTER"
  | "FEATURE_FLAGS"
  | "PLUGIN_MARKETPLACE"
  | "LICENSE_SUBSCRIPTION"
  | "BILLING_ORCHESTRATOR"
  | "MULTI_REGION_DEPLOYMENT"
  | "DISASTER_RECOVERY"
  | "BACKUP_RESTORE"
  | "OBSERVABILITY"
  | "ENTERPRISE_HEALTH"
  | "AI_GOVERNANCE"
  | "ENTERPRISE_COMMAND_CENTER";

export interface GlobalPlatformEntry {
  id: string;
  tenantId: string;
  capability: GlobalPlatformCapability;
  code: string;
  name: string;
  status: "DRAFT" | "ACTIVE" | "SUSPENDED" | "RETIRED";
  configuration: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalPlatformExecution {
  id: string;
  capability: GlobalPlatformCapability;
  entryId: string;
  operation: string;
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
  result?: Record<string, string | number | boolean>;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalPlatformHealth {
  capability: GlobalPlatformCapability;
  status: "HEALTHY" | "DEGRADED" | "UNAVAILABLE";
  score: number;
  message: string;
  checkedAt: string;
}