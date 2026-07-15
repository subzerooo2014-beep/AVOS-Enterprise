export type UniversalIndustryCapability =
  | "INDUSTRY_ENGINE"
  | "INDUSTRY_REGISTRY"
  | "INDUSTRY_RUNTIME"
  | "WORKFLOW_ENGINE"
  | "AI_INTELLIGENCE"
  | "ASSET_ENGINE"
  | "FINANCE_ENGINE"
  | "COMPLIANCE_ENGINE"
  | "RISK_ENGINE"
  | "ANALYTICS_ENGINE"
  | "COMMAND_CENTER"
  | "DASHBOARD_ENGINE"
  | "NOTIFICATION_ENGINE"
  | "AUTOMATION_ENGINE"
  | "REPORT_ENGINE"
  | "KPI_ENGINE"
  | "DOCUMENT_ENGINE"
  | "INTEGRATION_ENGINE"
  | "PLUGIN_SDK"
  | "TEMPLATE_ENGINE";

export interface IndustryDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  version: string;
  capabilities: UniversalIndustryCapability[];
  status: "DRAFT" | "ACTIVE" | "DEPRECATED";
  createdAt: string;
  updatedAt: string;
}

export interface IndustryRuntimeInstance {
  id: string;
  industryCode: string;
  tenantId: string;
  environment: "DEVELOPMENT" | "STAGING" | "PRODUCTION";
  status: "PROVISIONING" | "ACTIVE" | "SUSPENDED" | "TERMINATED";
  configuration: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryWorkflow {
  id: string;
  runtimeId: string;
  name: string;
  workflowType: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
  steps: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IndustryAsset {
  id: string;
  runtimeId: string;
  assetType: string;
  code: string;
  name: string;
  value: number;
  currency: string;
  status: "ACTIVE" | "MAINTENANCE" | "RETIRED";
  createdAt: string;
  updatedAt: string;
}

export interface IndustryFinancialEntry {
  id: string;
  runtimeId: string;
  entryType: "REVENUE" | "EXPENSE" | "ASSET" | "LIABILITY";
  amount: number;
  currency: string;
  reference: string;
  createdAt: string;
}

export interface IndustryRisk {
  id: string;
  runtimeId: string;
  riskType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  probability: number;
  impact: number;
  mitigation: string;
  status: "OPEN" | "MITIGATING" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}

export interface IndustryInsight {
  id: string;
  runtimeId: string;
  insightType: string;
  score: number;
  summary: string;
  recommendations: string[];
  createdAt: string;
}

export interface IndustryKpi {
  id: string;
  runtimeId: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
  status: "ON_TRACK" | "AT_RISK" | "OFF_TRACK";
  recordedAt: string;
}

export interface IndustryDocument {
  id: string;
  runtimeId: string;
  documentType: string;
  title: string;
  uri: string;
  status: "DRAFT" | "APPROVED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface IndustryPlugin {
  id: string;
  name: string;
  version: string;
  entryPoint: string;
  capabilities: UniversalIndustryCapability[];
  status: "REGISTERED" | "ACTIVE" | "DISABLED";
  createdAt: string;
  updatedAt: string;
}

export interface IndustryTemplate {
  id: string;
  code: string;
  name: string;
  industryCode: string;
  configuration: Record<string, string | number | boolean>;
  status: "DRAFT" | "PUBLISHED" | "RETIRED";
  createdAt: string;
  updatedAt: string;
}