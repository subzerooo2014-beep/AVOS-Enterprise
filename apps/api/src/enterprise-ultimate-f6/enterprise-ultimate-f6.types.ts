export type EnterpriseUltimateF6Capability =
  | "BLUEPRINT_INTELLIGENCE"
  | "ENTITY_COMPOSITION"
  | "SERVICE_ORCHESTRATION"
  | "CONTROLLER_AUTOMATION"
  | "WEB_EXPERIENCE_GENERATION"
  | "FLUTTER_EXPERIENCE_GENERATION"
  | "TEST_AUTOMATION"
  | "DOCUMENTATION_AUTOMATION"
  | "SAFE_MERGE"
  | "ROLLBACK_EVIDENCE"
  | "GIT_AUTOMATION_V2"
  | "AI_PACK_COMPOSITION";

export interface EnterpriseUltimateF6Record {
  id: string;
  capability: EnterpriseUltimateF6Capability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}