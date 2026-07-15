export type SpecializedIndustryCode =
  | "AGRICULTURE_AGRITECH"
  | "FOOD_BEVERAGE"
  | "MINING_RESOURCES"
  | "MEDIA_ENTERTAINMENT"
  | "SPORTS_EVENTS"
  | "LEGAL_PROFESSIONAL_SERVICES"
  | "SECURITY_EMERGENCY_SERVICES"
  | "ENVIRONMENT_WASTE"
  | "SPACE_SATELLITE"
  | "NONPROFIT_HUMANITARIAN";

export type SpecializedCapability =
  | "CORE_OPERATIONS"
  | "ASSET_RESOURCE_MANAGEMENT"
  | "CUSTOMER_BENEFICIARY_360"
  | "WORKFORCE_VOLUNTEERS"
  | "SUPPLY_CHAIN"
  | "FINANCE_FUNDING"
  | "COMPLIANCE_SAFETY"
  | "RISK_RESILIENCE"
  | "AI_INTELLIGENCE"
  | "AUTOMATION"
  | "ECOSYSTEM_MARKETPLACE"
  | "ANALYTICS_IMPACT"
  | "DOCUMENTS_CASES"
  | "NOTIFICATIONS_RESPONSE"
  | "COMMAND_CENTER";

export interface SpecializedIndustryRecord {
  id: string;
  tenantId: string;
  industry: SpecializedIndustryCode;
  capability: SpecializedCapability;
  code: string;
  name: string;
  owner: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
  attributes: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface SpecializedIndustryMission {
  id: string;
  recordId: string;
  missionType: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "PLANNED" | "RUNNING" | "COMPLETED" | "FAILED";
  evidence: string[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpecializedIndustryInsight {
  id: string;
  recordId: string;
  insightType: string;
  score: number;
  summary: string;
  actions: string[];
  createdAt: string;
}