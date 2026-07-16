export type EnterpriseIntelligenceLayerCapability =
  | "ENTERPRISE_INTENT_OS"
  | "ENTERPRISE_DECISION_COMPILER"
  | "AI_ARCHITECTURE_GENOME"
  | "ENTERPRISE_KNOWLEDGE_CONSTITUTION"
  | "ENTERPRISE_CONTINUITY_ENGINE"
  | "ENTERPRISE_HERITAGE_ENGINE"
  | "AI_FUTURE_COMPATIBILITY_ANALYZER"
  | "ENTERPRISE_TRUST_SCORE"
  | "AUTONOMOUS_TECHNICAL_DEBT_MANAGER"
  | "ENTERPRISE_VALUE_GRAPH";

export interface EnterpriseIntelligenceLayerRecord {
  id: string;
  capability: EnterpriseIntelligenceLayerCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}