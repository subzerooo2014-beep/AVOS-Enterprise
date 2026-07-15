export type UltraIndustryCode =
  | "ENERGY_UTILITIES"
  | "RETAIL_COMMERCE"
  | "HOSPITALITY_TOURISM"
  | "EDUCATION"
  | "GOVERNMENT_PUBLIC_SECTOR"
  | "BANKING_FINTECH"
  | "INSURANCE"
  | "TELECOMMUNICATIONS"
  | "AVIATION"
  | "MARITIME";

export type UltraIndustryCapability =
  | "CORE_OPERATIONS"
  | "ASSET_MANAGEMENT"
  | "CUSTOMER_CITIZEN_360"
  | "WORKFORCE"
  | "SUPPLY_CHAIN"
  | "FINANCE_REVENUE"
  | "COMPLIANCE"
  | "RISK"
  | "AI_INTELLIGENCE"
  | "AUTOMATION"
  | "MARKETPLACE_ECOSYSTEM"
  | "ANALYTICS"
  | "DOCUMENTS"
  | "NOTIFICATIONS"
  | "COMMAND_CENTER";

export interface UltraIndustryRecord {
  id: string;
  tenantId: string;
  industry: UltraIndustryCode;
  capability: UltraIndustryCapability;
  code: string;
  name: string;
  owner: string;
  status: "DRAFT" | "ACTIVE" | "SUSPENDED" | "COMPLETED";
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface UltraIndustryWorkflow {
  id: string;
  recordId: string;
  workflowType: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
  evidence: string[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UltraIndustryInsight {
  id: string;
  recordId: string;
  insightType: string;
  score: number;
  summary: string;
  recommendations: string[];
  createdAt: string;
}