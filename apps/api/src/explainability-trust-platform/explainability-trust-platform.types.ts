export type ExplainabilityTrustPlatformCapability =
  | "EXPLAINABILITY_ENGINE"
  | "ENTERPRISE_TRUST_GRAPH"
  | "KNOWLEDGE_TIMELINE"
  | "SUSTAINABILITY_SCORE"
  | "UPGRADE_ADVISOR"
  | "DECISION_EXPLANATION"
  | "TRUST_SCORE"
  | "PROVENANCE_TRACKING"
  | "EVIDENCE_CHAIN"
  | "TRANSPARENCY_CENTER";

export interface ExplainabilityTrustPlatformRecord {
  id: string;
  capability: ExplainabilityTrustPlatformCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}