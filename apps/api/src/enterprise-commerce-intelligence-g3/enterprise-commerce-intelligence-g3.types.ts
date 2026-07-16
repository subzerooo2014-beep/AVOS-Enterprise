export type EnterpriseCommerceIntelligenceG3Capability =
  | "COMMERCE_GRAPH"
  | "ADAPTIVE_PRICING"
  | "REVENUE_OPTIMIZATION"
  | "DEMAND_FORECASTING"
  | "CUSTOMER_VALUE_INTELLIGENCE"
  | "OFFER_COMPOSITION"
  | "MARKETPLACE_LIQUIDITY"
  | "TRANSACTION_INTELLIGENCE"
  | "MARGIN_PROTECTION"
  | "COMMERCE_RISK_CONTROL"
  | "GROWTH_EXPERIMENTATION"
  | "COMMERCE_EVIDENCE";

export interface EnterpriseCommerceIntelligenceG3Record {
  id: string;
  capability: EnterpriseCommerceIntelligenceG3Capability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}