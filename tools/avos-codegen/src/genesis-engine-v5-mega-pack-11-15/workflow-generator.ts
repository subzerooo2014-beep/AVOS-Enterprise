import {
  V5AgentRuntimeInput,
  V5WorkflowDefinition,
} from "./contracts";

export class V5WorkflowGenerator {
  generate(input: V5AgentRuntimeInput): V5WorkflowDefinition[] {
    return input.workflows.map((workflow) => {
      const matchingAgents = input.agents.filter((agent) =>
        agent.goals.some((goal) =>
          workflow.goals.some((workflowGoal) =>
            workflowGoal.toLowerCase().includes(goal.toLowerCase()) ||
            goal.toLowerCase().includes(workflowGoal.toLowerCase()),
          ),
        ),
      );

      const steps: V5WorkflowDefinition["steps"] = [];
      let order = 1;

      steps.push({
        order: order++,
        key: "validate-trigger",
        type: "decision",
        target: workflow.trigger,
        retryAttempts: 0,
      });

      for (const agent of matchingAgents) {
        steps.push({
          order: order++,
          key: `agent-${agent.key}`,
          type: "agent",
          target: agent.key,
          retryAttempts: 2,
          compensation: `compensate-${agent.key}`,
        });
      }

      if (
        workflow.criticality === "high" ||
        input.enableHumanApproval !== false
      ) {
        steps.push({
          order: order++,
          key: "human-approval",
          type: "approval",
          target: "enterprise-approver",
          retryAttempts: 0,
        });
      }

      steps.push({
        order: order++,
        key: "publish-completion-event",
        type: "event",
        target: `${workflow.key}.completed`,
        retryAttempts: 3,
      });

      return {
        key: workflow.key,
        trigger: workflow.trigger,
        steps,
        completionEvent: `${workflow.key}.completed`,
      };
    });
  }
}
