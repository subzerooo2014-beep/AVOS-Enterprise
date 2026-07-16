export type EnterpriseGlobalOperationsG2Capability =
  | "GLOBAL_MARKET_INTELLIGENCE"
  | "AUTONOMOUS_EXPANSION"
  | "PARTNER_NETWORK_ORCHESTRATION"
  | "REGULATION_INTELLIGENCE"
  | "CROSS_BORDER_COMMERCE"
  | "OPPORTUNITY_DISCOVERY"
  | "RISK_RADAR"
  | "RESOURCE_OPTIMIZATION"
  | "ENTERPRISE_COLLABORATION"
  | "SCENARIO_SIMULATION"
  | "GLOBAL_GROWTH_CONTROL"
  | "OPERATIONS_EVIDENCE";

export interface EnterpriseGlobalOperationsG2Record {
  id: string;
  capability: EnterpriseGlobalOperationsG2Capability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}