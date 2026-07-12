export type V5BusinessPrimitive = string | number | boolean | null;
export type V5BusinessValue =
  | V5BusinessPrimitive
  | V5BusinessValue[]
  | { [key: string]: V5BusinessValue };

export enum V5BusinessStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V5MarketplaceDomain {
  key: string;
  type: "product" | "service" | "digital" | "advertising";
  commissionPercent: number;
  settlementDays: number;
  riskLevel: "low" | "medium" | "high";
}

export interface V5BusinessRuntimeInput {
  systemKey: string;
  currency: string;
  marketplaceDomains: V5MarketplaceDomain[];
  partners: string[];
  complianceFrameworks: string[];
  enableFraudControls?: boolean;
  enableDataGovernance?: boolean;
  enableRevenueIntelligence?: boolean;
}

export interface V5CatalogPolicy {
  domainKey: string;
  publishRequirements: string[];
  moderationRequired: boolean;
  versioningEnabled: boolean;
}

export interface V5CommissionPolicy {
  domainKey: string;
  commissionPercent: number;
  settlementDays: number;
  reservePercent: number;
}

export interface V5LedgerAccount {
  key: string;
  category: "asset" | "liability" | "revenue" | "expense" | "equity";
  currency: string;
  immutable: boolean;
}

export interface V5SettlementFlow {
  key: string;
  sourceAccount: string;
  destinationAccount: string;
  trigger: string;
  reconciliationRequired: boolean;
}

export interface V5KpiDefinition {
  key: string;
  category: "revenue" | "operations" | "risk" | "customer";
  formula: string;
  refreshMinutes: number;
}

export interface V5ComplianceControl {
  key: string;
  framework: string;
  objective: string;
  evidenceRequired: string[];
  enforcement: "preventive" | "detective" | "corrective";
}

export interface V5IntegrationContract {
  partnerKey: string;
  protocol: "rest" | "event" | "file";
  authentication: "oauth2" | "mtls" | "signed-token";
  operations: string[];
}
