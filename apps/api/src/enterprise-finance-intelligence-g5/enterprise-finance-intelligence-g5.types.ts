export type EnterpriseFinanceIntelligenceG5Capability =
  | "FINANCE_COCKPIT"
  | "CASHFLOW_FORECASTING"
  | "MARGIN_INTELLIGENCE"
  | "BUDGET_AUTOMATION"
  | "COST_OPTIMIZATION"
  | "FINANCIAL_RISK_RADAR"
  | "CAPITAL_ALLOCATION"
  | "REVENUE_RECOGNITION"
  | "SCENARIO_FINANCE"
  | "TREASURY_INTELLIGENCE"
  | "FINANCIAL_GOVERNANCE"
  | "FINANCE_EVIDENCE";

export interface EnterpriseFinanceIntelligenceG5Record {
  id: string;
  capability: EnterpriseFinanceIntelligenceG5Capability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}