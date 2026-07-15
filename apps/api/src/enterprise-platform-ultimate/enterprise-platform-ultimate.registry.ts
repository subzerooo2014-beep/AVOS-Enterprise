import { EnterpriseDomain } from "./enterprise-platform-ultimate.types";

export const ENTERPRISE_PLATFORM_DOMAINS: Record<
  EnterpriseDomain,
  { name: string; capabilities: string[] }
> = {
  AI_AGENTS_OS: {
    name: "Enterprise AI Agents OS",
    capabilities: [
      "AGENT_MARKETPLACE",
      "AGENT_ORCHESTRATOR",
      "MULTI_AGENT_RUNTIME",
      "AGENT_MEMORY",
      "AGENT_GOVERNANCE",
      "AGENT_TOOL_REGISTRY",
      "AGENT_POLICY_ENGINE",
      "AGENT_OBSERVABILITY",
    ],
  },
  KNOWLEDGE_DIGITAL_TWIN: {
    name: "Enterprise Knowledge & Digital Twin",
    capabilities: [
      "KNOWLEDGE_GRAPH",
      "DIGITAL_TWIN",
      "DATA_FABRIC",
      "SEMANTIC_SEARCH",
      "VECTOR_INTELLIGENCE",
      "AI_MEMORY_MESH",
      "ENTITY_RESOLUTION",
      "KNOWLEDGE_GOVERNANCE",
    ],
  },
  AUTOMATION_OS: {
    name: "Enterprise Automation OS",
    capabilities: [
      "BPM_ENGINE",
      "PROCESS_MINING",
      "RPA_RUNTIME",
      "SCHEDULER",
      "WORKFLOW_STUDIO",
      "RULES_ENGINE",
      "EVENT_AUTOMATION",
      "AUTOMATION_MARKETPLACE",
    ],
  },
  SECURITY_OS: {
    name: "Enterprise Security OS",
    capabilities: [
      "ZERO_TRUST",
      "IAM",
      "SECRETS_VAULT",
      "SOC",
      "THREAT_INTELLIGENCE",
      "VULNERABILITY_MANAGEMENT",
      "POLICY_ENFORCEMENT",
      "SECURITY_COMMAND_CENTER",
    ],
  },
  CLOUD_OS: {
    name: "Enterprise Cloud OS",
    capabilities: [
      "KUBERNETES_MANAGEMENT",
      "MULTI_CLOUD",
      "DEVOPS",
      "CI_CD",
      "MONITORING",
      "DISASTER_RECOVERY",
      "COST_OPTIMIZATION",
      "CLOUD_COMMAND_CENTER",
    ],
  },
  MARKETPLACE_OS: {
    name: "Enterprise Marketplace OS",
    capabilities: [
      "PLUGIN_MARKETPLACE",
      "BLUEPRINT_MARKETPLACE",
      "AGENT_MARKETPLACE",
      "BILLING",
      "LICENSING",
      "COMMERCIAL_PORTAL",
      "PARTNER_ECONOMY",
      "GLOBAL_COMMAND_CENTER",
    ],
  },
};