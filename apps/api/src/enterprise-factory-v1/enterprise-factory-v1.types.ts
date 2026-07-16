export type EnterpriseFactoryV1Capability =
  | "BLUEPRINT_CATALOG"
  | "TEMPLATE_MARKETPLACE"
  | "GENERATION_QUEUE"
  | "PIPELINE_ORCHESTRATOR"
  | "ARTIFACT_REGISTRY"
  | "ROLLBACK_MANAGER"
  | "EXECUTION_MONITOR"
  | "FACTORY_DASHBOARD"
  | "COMPATIBILITY_GATE"
  | "QUALITY_GATE"
  | "RELEASE_EVIDENCE"
  | "FACTORY_AUTOMATION";

export interface EnterpriseFactoryV1Record {
  id: string;
  capability: EnterpriseFactoryV1Capability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}