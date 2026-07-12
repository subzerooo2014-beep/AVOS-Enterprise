import {
  V5AgentDefinition,
  V5AgentRuntimeInput,
} from "./contracts";

export class V5AgentDefinitionGenerator {
  generate(input: V5AgentRuntimeInput): V5AgentDefinition[] {
    return input.agents.map((agent) => ({
      key: agent.key,
      role: agent.role,
      goals: agent.goals,
      allowedTools: agent.tools,
      memoryMode:
        input.enableMemory === false || agent.memoryRequired === false
          ? "none"
          : agent.memoryRequired
            ? "persistent"
            : "short-term",
      approvalMode:
        input.enableHumanApproval !== false &&
        agent.humanApprovalRequired
          ? "human-required"
          : "automatic",
    }));
  }
}
