export type ProductSuiteKey =
  | "CRM"
  | "ERP"
  | "MARKETPLACE"
  | "AI_ENTERPRISE"
  | "INDUSTRY_PACKS"
  | "GLOBAL_SAAS";

export interface ProductCapability {
  key: string;
  name: string;
  suite: ProductSuiteKey;
  reusable: boolean;
  multiIndustry: boolean;
  active: boolean;
}

export interface CrmCustomer360 {
  id: string;
  tenantId: string;
  customerId: string;
  name: string;
  email?: string;
  phone?: string;
  lifecycleStage: "LEAD" | "PROSPECT" | "CUSTOMER" | "LOYAL" | "CHURNED";
  trustScore: number;
  loyaltyPoints: number;
  preferences: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ErpRecord {
  id: string;
  tenantId: string;
  domain: "FINANCE" | "PROCUREMENT" | "INVENTORY" | "WAREHOUSE" | "HR" | "PROJECTS";
  reference: string;
  amount?: number;
  currency?: string;
  quantity?: number;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplacePortalProfile {
  id: string;
  tenantId: string;
  portalType: "DEALER" | "SELLER" | "BUYER";
  ownerId: string;
  displayName: string;
  active: boolean;
  capabilities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AiEnterpriseTask {
  id: string;
  tenantId: string;
  agentType: "EXECUTIVE" | "SALES" | "MARKETING" | "FINANCE" | "SUPPORT" | "OPERATIONS";
  objective: string;
  input: Record<string, unknown>;
  recommendations: string[];
  confidence: number;
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "REVIEW_REQUIRED";
  humanFinalDecisionRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryPackActivation {
  id: string;
  tenantId: string;
  industryKey:
    | "AUTOMOTIVE"
    | "HEAVY_EQUIPMENT"
    | "MARINE"
    | "AVIATION"
    | "CAMPING_CARAVANS"
    | "MOTORCYCLES"
    | "TRUCKS_BUSES";
  enabledCapabilities: string[];
  active: boolean;
  configuration: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SaasTenant {
  id: string;
  name: string;
  slug: string;
  plan: "FREE" | "PRO" | "PREMIUM" | "ENTERPRISE";
  status: "TRIAL" | "ACTIVE" | "SUSPENDED" | "CANCELLED";
  whiteLabel: boolean;
  primaryRegion: string;
  currency: string;
  locale: string;
  subscriptionAmount: number;
  appStoreEnabled: boolean;
  apiAccessEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}