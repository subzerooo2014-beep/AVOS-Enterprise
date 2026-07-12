import { randomUUID } from "node:crypto";
import {
  V5AgentRuntimeInput,
  V5AgentRuntimeStatus,
} from "./contracts";
import { V5WorkflowGenerator } from "./workflow-generator";
import { V5AgentDefinitionGenerator } from "./agent-generator";
import { V5ToolContractGenerator } from "./tool-contract-generator";
import { V5GuardrailGenerator } from "./guardrail-generator";
import { V5MemoryObservabilityGenerator } from "./memory-observability-generator";
import { V5AgentRuntimeTestPlanGenerator } from "./test-plan-generator";

export interface V5AgentRuntimeResult {
  success: boolean;
  status: V5AgentRuntimeStatus;
  score: number;
  workflows: ReturnType<V5WorkflowGenerator["generate"]>;
  agents: ReturnType<V5AgentDefinitionGenerator["generate"]>;
  tools: ReturnType<V5ToolContractGenerator["generate"]>;
  guardrails: ReturnType<V5GuardrailGenerator["generate"]>;
  memoryPlans: ReturnType<V5MemoryObservabilityGenerator["memory"]>;
  observability: ReturnType<
    V5MemoryObservabilityGenerator["observability"]
  >;
  testPlan: ReturnType<V5AgentRuntimeTestPlanGenerator["generate"]>;
  enterpriseBrainPayload: Record<string, unknown>;
  evolutionCenterPayload: Record<string, unknown>;
  evidence: Array<{
    id: string;
    action: string;
    message: string;
    createdAt: string;
  }>;
  completedAt: string;
}

export class GenesisV5AgentRuntimeOrchestrator {
  constructor(
    readonly workflowGenerator = new V5WorkflowGenerator(),
    readonly agentGenerator = new V5AgentDefinitionGenerator(),
    readonly toolGenerator = new V5ToolContractGenerator(),
    readonly guardrailGenerator = new V5GuardrailGenerator(),
    readonly memoryObservability =
      new V5MemoryObservabilityGenerator(),
    readonly testGenerator =
      new V5AgentRuntimeTestPlanGenerator(),
  ) {}

  execute(input: V5AgentRuntimeInput): V5AgentRuntimeResult {
    const agents = this.agentGenerator.generate(input);
    const tools = this.toolGenerator.generate(input);
    const workflows = this.workflowGenerator.generate(input);
    const guardrails = this.guardrailGenerator.generate(
      agents,
      tools,
      input.enableGuardrails !== false,
    );
    const memoryPlans = this.memoryObservability.memory(agents);
    const observability =
      this.memoryObservability.observability();
    const testPlan = this.testGenerator.generate(
      workflows,
      agents,
      guardrails,
    );

    const workflowCoverage =
      input.workflows.length === 0
        ? 0
        : Math.round(
            (workflows.length / input.workflows.length) * 100,
          );

    const agentCoverage =
      input.agents.length === 0
        ? 0
        : Math.round((agents.length / input.agents.length) * 100);

    const controlCoverage = [
      tools.length > 0,
      guardrails.length > 0,
      observability.correlationRequired,
      testPlan.workflowTests.length === workflows.length,
      testPlan.agentTests.length === agents.length,
    ].filter(Boolean).length;

    const controlScore = Math.round(
      (controlCoverage / 5) * 100,
    );

    const score = Math.round(
      (workflowCoverage + agentCoverage + controlScore) / 3,
    );

    const success =
      input.workflows.length > 0 &&
      input.agents.length > 0 &&
      workflows.length === input.workflows.length &&
      agents.length === input.agents.length &&
      tools.length > 0 &&
      guardrails.length > 0 &&
      score >= 80;

    const status = success
      ? V5AgentRuntimeStatus.READY
      : score >= 60
        ? V5AgentRuntimeStatus.DEGRADED
        : V5AgentRuntimeStatus.BLOCKED;

    return {
      success,
      status,
      score,
      workflows,
      agents,
      tools,
      guardrails,
      memoryPlans,
      observability,
      testPlan,
      enterpriseBrainPayload: {
        type: "genesis-v5-agent-runtime",
        systemKey: input.systemKey,
        workflows,
        agents,
        tools,
        guardrails,
        memoryPlans,
        observability,
      },
      evolutionCenterPayload: {
        type: "genesis-v5-agent-runtime-baseline",
        systemKey: input.systemKey,
        score,
        workflows: workflows.length,
        agents: agents.length,
        tools: tools.length,
        guardrails: guardrails.length,
        memoryPlans: memoryPlans.length,
      },
      evidence: [
        {
          id: randomUUID(),
          action: "genesis-v5.agent-runtime.completed",
          message: `Autonomous agent runtime completed with score ${score}.`,
          createdAt: new Date().toISOString(),
        },
      ],
      completedAt: new Date().toISOString(),
    };
  }
}
