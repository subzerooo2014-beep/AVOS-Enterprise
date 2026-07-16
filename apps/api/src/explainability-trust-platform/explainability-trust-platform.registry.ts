import { ExplainabilityTrustPlatformCapability } from "./explainability-trust-platform.types";

export const EXPLAINABILITY_TRUST_PLATFORM_CAPABILITIES: Readonly<Record<ExplainabilityTrustPlatformCapability, string>> = {
  EXPLAINABILITY_ENGINE: "Explainability Engine",
  ENTERPRISE_TRUST_GRAPH: "Enterprise Trust Graph",
  KNOWLEDGE_TIMELINE: "Knowledge Timeline",
  SUSTAINABILITY_SCORE: "Sustainability Score",
  UPGRADE_ADVISOR: "Upgrade Advisor",
  DECISION_EXPLANATION: "Decision Explanation",
  TRUST_SCORE: "Trust Score",
  PROVENANCE_TRACKING: "Provenance Tracking",
  EVIDENCE_CHAIN: "Evidence Chain",
  TRANSPARENCY_CENTER: "Transparency Center",
};