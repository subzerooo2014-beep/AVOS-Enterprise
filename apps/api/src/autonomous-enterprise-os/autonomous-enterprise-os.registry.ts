import { AutonomousEnterpriseDomain } from "./autonomous-enterprise-os.types";

export const AUTONOMOUS_ENTERPRISE_DOMAINS: Record<
  AutonomousEnterpriseDomain,
  { name: string; capabilities: string[] }
> = {
  AUTONOMOUS_AI: {
    name: "Autonomous AI",
    capabilities: [
      "AUTONOMOUS_DECISION_ENGINE",
      "AUTONOMOUS_PLANNING_ENGINE",
      "AUTONOMOUS_EXECUTION_ENGINE",
      "AUTONOMOUS_OPTIMIZATION_ENGINE",
      "AUTONOMOUS_LEARNING_ENGINE",
      "AUTONOMOUS_RECOVERY_ENGINE",
    ],
  },
  ENTERPRISE_SWARM: {
    name: "Enterprise Swarm",
    capabilities: [
      "MULTI_AGENT_SWARM",
      "TASK_DISTRIBUTION_ENGINE",
      "AI_COLLABORATION_MESH",
      "RESOURCE_NEGOTIATION_ENGINE",
      "CAPABILITY_MARKETPLACE",
      "AUTONOMOUS_DELEGATION",
    ],
  },
  SELF_EVOLUTION: {
    name: "Self Evolution",
    capabilities: [
      "SELF_HEALING_PLATFORM",
      "SELF_OPTIMIZATION_ENGINE",
      "SELF_SCALING_ENGINE",
      "SELF_SECURITY_ENGINE",
      "SELF_MONITORING_ENGINE",
      "SELF_TESTING_ENGINE",
    ],
  },
  ENTERPRISE_BRAIN_V3: {
    name: "Enterprise Brain V3",
    capabilities: [
      "STRATEGIC_BRAIN",
      "FINANCIAL_BRAIN",
      "OPERATIONS_BRAIN",
      "SALES_BRAIN",
      "MARKETING_BRAIN",
      "CUSTOMER_BRAIN",
      "KNOWLEDGE_BRAIN",
    ],
  },
  GLOBAL_OPERATIONS: {
    name: "Global Operations",
    capabilities: [
      "GLOBAL_COMMAND_CENTER",
      "GLOBAL_MONITORING",
      "GLOBAL_POLICY_ENGINE",
      "GLOBAL_COMPLIANCE",
      "GLOBAL_DEPLOYMENT",
      "GLOBAL_DISASTER_RECOVERY",
    ],
  },
  AI_ECONOMY: {
    name: "AI Economy",
    capabilities: [
      "AI_MARKETPLACE",
      "AI_BILLING",
      "AI_LICENSING",
      "AI_REVENUE_ENGINE",
      "AI_PARTNER_NETWORK",
      "AI_BUSINESS_HUB",
    ],
  },
};