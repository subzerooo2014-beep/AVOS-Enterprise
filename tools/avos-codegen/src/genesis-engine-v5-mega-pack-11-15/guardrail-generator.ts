import {
  V5AgentDefinition,
  V5GuardrailPolicy,
  V5ToolContract,
} from "./contracts";

export class V5GuardrailGenerator {
  generate(
    agents: readonly V5AgentDefinition[],
    tools: readonly V5ToolContract[],
    enabled: boolean,
  ): V5GuardrailPolicy[] {
    if (!enabled) return [];

    const policies: V5GuardrailPolicy[] = [
      {
        key: "guardrail.tenant-scope",
        appliesTo: agents.map((agent) => agent.key),
        rule: "agent actions must remain inside the active tenant scope",
        action: "block",
      },
      {
        key: "guardrail.tool-allowlist",
        appliesTo: agents.map((agent) => agent.key),
        rule: "agents may invoke only explicitly allowed tools",
        action: "block",
      },
      {
        key: "guardrail.evidence-required",
        appliesTo: agents.map((agent) => agent.key),
        rule: "every mutating action must emit execution evidence",
        action: "allow-with-evidence",
      },
    ];

    for (const tool of tools.filter((item) => item.riskLevel === "high")) {
      policies.push({
        key: `guardrail.${tool.key}.approval`,
        appliesTo: [tool.key],
        rule: "high-risk tool execution requires human approval",
        action: "review",
      });
    }

    return policies;
  }
}
