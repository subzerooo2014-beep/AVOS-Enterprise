import {
  V5AgentDefinition,
  V5GuardrailPolicy,
  V5WorkflowDefinition,
} from "./contracts";

export interface V5AgentRuntimeTestPlan {
  workflowTests: Array<{
    workflow: string;
    scenarios: string[];
  }>;
  agentTests: Array<{
    agent: string;
    scenarios: string[];
  }>;
  guardrailTests: Array<{
    policy: string;
    scenarios: string[];
  }>;
}

export class V5AgentRuntimeTestPlanGenerator {
  generate(
    workflows: readonly V5WorkflowDefinition[],
    agents: readonly V5AgentDefinition[],
    guardrails: readonly V5GuardrailPolicy[],
  ): V5AgentRuntimeTestPlan {
    return {
      workflowTests: workflows.map((workflow) => ({
        workflow: workflow.key,
        scenarios: [
          "happy path completes",
          "failed step retries",
          "compensation executes",
          "completion event is emitted",
        ],
      })),
      agentTests: agents.map((agent) => ({
        agent: agent.key,
        scenarios: [
          "allowed tool executes",
          "unknown tool is rejected",
          "memory policy is honored",
          "approval mode is enforced",
        ],
      })),
      guardrailTests: guardrails.map((guardrail) => ({
        policy: guardrail.key,
        scenarios: [
          "matching violation is detected",
          "configured action is enforced",
          "evidence is recorded",
        ],
      })),
    };
  }
}
