export type EnterpriseInnovationGrowthG8Capability =
  | "INNOVATION_LAB"
  | "OPPORTUNITY_CLOUD"
  | "AUTONOMOUS_GROWTH"
  | "EXPERIMENT_FACTORY"
  | "VENTURE_SIMULATION"
  | "MARKET_EXPANSION_AI"
  | "PRODUCT_DISCOVERY"
  | "GROWTH_SWARM"
  | "CAPABILITY_FUSION"
  | "VALUE_CREATION_ENGINE"
  | "PLATFORM_EVOLUTION"
  | "INNOVATION_EVIDENCE";

export interface EnterpriseInnovationGrowthG8Record {
  id: string;
  capability: EnterpriseInnovationGrowthG8Capability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}