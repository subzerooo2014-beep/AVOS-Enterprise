export type EnterpriseDomain =
  | "AI_AGENTS_OS"
  | "KNOWLEDGE_DIGITAL_TWIN"
  | "AUTOMATION_OS"
  | "SECURITY_OS"
  | "CLOUD_OS"
  | "MARKETPLACE_OS";

export type EnterpriseCapabilityStatus =
  | "REGISTERED"
  | "ACTIVE"
  | "SUSPENDED"
  | "FAILED";

export interface EnterpriseCapability {
  id: string;
  domain: EnterpriseDomain;
  code: string;
  name: string;
  version: string;
  status: EnterpriseCapabilityStatus;
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseExecution {
  id: string;
  capabilityId: string;
  action: string;
  payload: Record<string, unknown>;
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
  result?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface EnterprisePolicy {
  id: string;
  domain: EnterpriseDomain;
  code: string;
  rule: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseMarketplaceItem {
  id: string;
  productType: "PLUGIN" | "BLUEPRINT" | "AGENT" | "CONNECTOR" | "TEMPLATE";
  code: string;
  name: string;
  version: string;
  price: number;
  currency: string;
  status: "DRAFT" | "PUBLISHED" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}