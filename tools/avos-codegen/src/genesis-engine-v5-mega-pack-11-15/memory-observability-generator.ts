import { V5AgentDefinition } from "./contracts";

export interface V5AgentMemoryPlan {
  agentKey: string;
  mode: string;
  retentionDays: number;
  namespaces: string[];
  piiFilteringEnabled: boolean;
}

export interface V5AgentObservabilityPlan {
  traces: string[];
  metrics: string[];
  logs: string[];
  correlationRequired: boolean;
}

export class V5MemoryObservabilityGenerator {
  memory(
    agents: readonly V5AgentDefinition[],
  ): V5AgentMemoryPlan[] {
    return agents
      .filter((agent) => agent.memoryMode !== "none")
      .map((agent) => ({
        agentKey: agent.key,
        mode: agent.memoryMode,
        retentionDays:
          agent.memoryMode === "persistent" ? 365 : 7,
        namespaces: [
          `${agent.key}.tasks`,
          `${agent.key}.decisions`,
          `${agent.key}.evidence`,
        ],
        piiFilteringEnabled: true,
      }));
  }

  observability(): V5AgentObservabilityPlan {
    return {
      traces: [
        "workflow.execution",
        "agent.decision",
        "tool.invocation",
        "approval.wait",
      ],
      metrics: [
        "workflow_success_rate",
        "agent_decision_latency_ms",
        "tool_failure_rate",
        "approval_wait_time_ms",
      ],
      logs: [
        "agent-input-summary",
        "agent-output-summary",
        "guardrail-decision",
        "execution-evidence",
      ],
      correlationRequired: true,
    };
  }
}
