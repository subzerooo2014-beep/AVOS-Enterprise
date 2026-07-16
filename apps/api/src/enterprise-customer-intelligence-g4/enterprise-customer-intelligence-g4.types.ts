export type EnterpriseCustomerIntelligenceG4Capability =
  | "CUSTOMER_360"
  | "CUSTOMER_JOURNEY_GENOME"
  | "RETENTION_INTELLIGENCE"
  | "LOYALTY_OPTIMIZATION"
  | "PERSONALIZATION_ENGINE"
  | "CUSTOMER_RISK_RADAR"
  | "LIFETIME_VALUE_FORECAST"
  | "NEXT_BEST_ACTION"
  | "EXPERIENCE_ORCHESTRATION"
  | "VOICE_OF_CUSTOMER"
  | "CUSTOMER_RECOVERY"
  | "CUSTOMER_EVIDENCE";

export interface EnterpriseCustomerIntelligenceG4Record {
  id: string;
  capability: EnterpriseCustomerIntelligenceG4Capability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}