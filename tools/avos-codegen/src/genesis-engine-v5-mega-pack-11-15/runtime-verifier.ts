import { V5AgentRuntimeResult } from "./orchestrator";

export interface V5AgentRuntimeHealth {
  healthy: boolean;
  status: string;
  score: number;
  workflows: number;
  agents: number;
  tools: number;
  guardrails: number;
  memoryPlans: number;
  workflowTests: number;
  agentTests: number;
  guardrailTests: number;
  evidenceCount: number;
}

export class GenesisV5AgentRuntimeVerifier {
  verify(result: V5AgentRuntimeResult): V5AgentRuntimeHealth {
    return {
      healthy:
        result.success &&
        result.score >= 80 &&
        result.workflows.length > 0 &&
        result.agents.length > 0 &&
        result.tools.length > 0 &&
        result.guardrails.length > 0 &&
        result.testPlan.workflowTests.length ===
          result.workflows.length &&
        result.testPlan.agentTests.length === result.agents.length,
      status: result.status,
      score: result.score,
      workflows: result.workflows.length,
      agents: result.agents.length,
      tools: result.tools.length,
      guardrails: result.guardrails.length,
      memoryPlans: result.memoryPlans.length,
      workflowTests: result.testPlan.workflowTests.length,
      agentTests: result.testPlan.agentTests.length,
      guardrailTests: result.testPlan.guardrailTests.length,
      evidenceCount: result.evidence.length,
    };
  }
}
