export type EnterpriseFactoryV2Capability =
  | "AUTONOMOUS_FACTORY_RUNTIME"
  | "PARALLEL_GENERATION"
  | "GENERATION_SCHEDULER"
  | "POLICY_GATE"
  | "APPROVAL_WORKFLOW"
  | "RELEASE_CHANNELS"
  | "FACTORY_ANALYTICS"
  | "FAILURE_RECOVERY"
  | "QUEUE_PRIORITIZATION"
  | "TEMPLATE_LIFECYCLE"
  | "ARTIFACT_PROMOTION"
  | "FACTORY_EVIDENCE";

export interface EnterpriseFactoryV2Record {
  id: string;
  capability: EnterpriseFactoryV2Capability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}