import {
  V5AgentRuntimeInput,
  V5ToolContract,
} from "./contracts";

export class V5ToolContractGenerator {
  generate(input: V5AgentRuntimeInput): V5ToolContract[] {
    const uniqueTools = Array.from(
      new Set(input.agents.flatMap((agent) => agent.tools)),
    );

    return uniqueTools.map((tool) => ({
      key: tool,
      description: `Execute ${tool} through AVOS controlled tool runtime.`,
      inputSchema: {
        tenantId: "string",
        actorId: "string",
        payload: "record",
        correlationId: "string",
      },
      outputSchema: {
        success: "boolean",
        result: "record",
        evidenceId: "string",
      },
      riskLevel:
        /delete|payment|publish|approve|transfer/i.test(tool)
          ? "high"
          : /update|create|send/i.test(tool)
            ? "medium"
            : "low",
    }));
  }
}
