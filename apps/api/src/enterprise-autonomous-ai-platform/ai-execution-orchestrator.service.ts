import { Injectable } from "@nestjs/common";
import { AiAgentRegistryService } from "./ai-agent-registry.service";
import { AiContextEngineService } from "./ai-context-engine.service";
import { AiPolicyEngineService } from "./ai-policy-engine.service";
import { AiTaskPlannerService } from "./ai-task-planner.service";
import { AiToolRegistryService } from "./ai-tool-registry.service";
import type { AiExecutionRecord } from "./enterprise-autonomous-ai.types";

@Injectable()
export class AiExecutionOrchestratorService {
  private readonly executions: AiExecutionRecord[] = [];

  constructor(
    private readonly agents: AiAgentRegistryService,
    private readonly tools: AiToolRegistryService,
    private readonly tasks: AiTaskPlannerService,
    private readonly policies: AiPolicyEngineService,
    private readonly contextEngine: AiContextEngineService,
  ) {}

  execute(taskId: string, agentId: string, toolId?: string) {
    const agent = this.agents.get(agentId);
    const task = this.tasks.get(taskId);
    const tool = toolId ? this.tools.get(toolId) : undefined;

    const context = this.contextEngine.compose(agentId, {
      taskId,
      objective: task.objective,
      toolId,
      riskLevel: tool?.riskLevel,
    });

    const policyDecision = this.policies.evaluate(context);
    const startedAt = new Date();
    const execution: AiExecutionRecord = {
      id: `ai-exec-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      taskId,
      agentId,
      toolId,
      status: policyDecision.outcome === "DENY" ? "DENIED" : "STARTED",
      startedAt: startedAt.toISOString(),
    };

    if (execution.status === "DENIED") {
      this.tasks.update(taskId, { status: "BLOCKED" });
    } else {
      this.tasks.update(taskId, { status: "RUNNING" });
      const completedAt = new Date();
      execution.status = "COMPLETED";
      execution.completedAt = completedAt.toISOString();
      execution.durationMs = completedAt.getTime() - startedAt.getTime();
      this.tasks.update(taskId, {
        status: "COMPLETED",
        completedAt: completedAt.toISOString(),
      });
    }

    this.executions.unshift(execution);
    if (this.executions.length > 1000) this.executions.length = 1000;

    return {
      success: execution.status === "COMPLETED",
      execution: { ...execution },
      agent,
      task: this.tasks.get(taskId),
      tool,
      policyDecision,
      context,
    };
  }

  list(): AiExecutionRecord[] {
    return this.executions.map((item) => ({ ...item }));
  }

  count(): number {
    return this.executions.length;
  }
}
