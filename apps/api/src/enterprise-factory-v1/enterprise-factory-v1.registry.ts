import { EnterpriseFactoryV1Capability } from "./enterprise-factory-v1.types";

export const ENTERPRISE_FACTORY_V1_CAPABILITIES: Readonly<Record<EnterpriseFactoryV1Capability, string>> = {
  BLUEPRINT_CATALOG: "Blueprint Catalog",
  TEMPLATE_MARKETPLACE: "Template Marketplace",
  GENERATION_QUEUE: "Generation Queue",
  PIPELINE_ORCHESTRATOR: "Pipeline Orchestrator",
  ARTIFACT_REGISTRY: "Artifact Registry",
  ROLLBACK_MANAGER: "Rollback Manager",
  EXECUTION_MONITOR: "Execution Monitor",
  FACTORY_DASHBOARD: "Factory Dashboard",
  COMPATIBILITY_GATE: "Compatibility Gate",
  QUALITY_GATE: "Quality Gate",
  RELEASE_EVIDENCE: "Release Evidence",
  FACTORY_AUTOMATION: "Factory Automation",
};