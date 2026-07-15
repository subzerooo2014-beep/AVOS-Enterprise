export type EcosystemCapability =
  | "DEVELOPER_PLATFORM"
  | "SDK_CENTER"
  | "PUBLIC_API_MANAGEMENT"
  | "WEBHOOKS_PLATFORM"
  | "EVENT_BUS_FEDERATION"
  | "INTEGRATION_MARKETPLACE"
  | "PARTNER_PORTAL"
  | "VENDOR_PORTAL"
  | "CUSTOMER_PORTAL"
  | "WHITE_LABEL_PLATFORM"
  | "MULTI_TENANT_PROVISIONING"
  | "ORGANIZATION_MANAGEMENT"
  | "IDENTITY_FEDERATION"
  | "API_KEYS_SECRETS"
  | "OAUTH_MANAGEMENT"
  | "APP_MARKETPLACE"
  | "EXTENSION_SDK"
  | "PLUGIN_RUNTIME"
  | "PLUGIN_REGISTRY"
  | "CONNECTOR_FRAMEWORK"
  | "ERP_CRM_CONNECTORS"
  | "PAYMENT_CONNECTORS"
  | "MESSAGING_CONNECTORS"
  | "AI_PROVIDER_CONNECTORS"
  | "EXTERNAL_SEARCH_CONNECTORS"
  | "LOW_CODE_AUTOMATION"
  | "WORKFLOW_MARKETPLACE"
  | "ENTERPRISE_TEMPLATES"
  | "SOLUTION_MARKETPLACE"
  | "ECOSYSTEM_COMMAND_CENTER";

export interface EcosystemApplication {
  id: string;
  tenantId: string;
  capability: EcosystemCapability;
  code: string;
  name: string;
  version: string;
  owner: string;
  status: "DRAFT" | "ACTIVE" | "SUSPENDED" | "RETIRED";
  configuration: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface EcosystemCredential {
  id: string;
  applicationId: string;
  credentialType: "API_KEY" | "OAUTH_CLIENT" | "WEBHOOK_SECRET" | "CONNECTOR_SECRET";
  label: string;
  maskedValue: string;
  active: boolean;
  createdAt: string;
  rotatedAt?: string;
}

export interface EcosystemExecution {
  id: string;
  applicationId: string;
  capability: EcosystemCapability;
  action: string;
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
  payload: Record<string, string | number | boolean>;
  result?: Record<string, string | number | boolean>;
  createdAt: string;
  completedAt?: string;
}