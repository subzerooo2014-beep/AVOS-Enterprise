import { EnterpriseFactoryV2Capability } from "./enterprise-factory-v2.types";

export const ENTERPRISE_FACTORY_V2_CAPABILITIES: Readonly<Record<EnterpriseFactoryV2Capability, string>> = {
  AUTONOMOUS_FACTORY_RUNTIME: "Autonomous Factory Runtime",
  PARALLEL_GENERATION: "Parallel Generation",
  GENERATION_SCHEDULER: "Generation Scheduler",
  POLICY_GATE: "Policy Gate",
  APPROVAL_WORKFLOW: "Approval Workflow",
  RELEASE_CHANNELS: "Release Channels",
  FACTORY_ANALYTICS: "Factory Analytics",
  FAILURE_RECOVERY: "Failure Recovery",
  QUEUE_PRIORITIZATION: "Queue Prioritization",
  TEMPLATE_LIFECYCLE: "Template Lifecycle",
  ARTIFACT_PROMOTION: "Artifact Promotion",
  FACTORY_EVIDENCE: "Factory Evidence",
};