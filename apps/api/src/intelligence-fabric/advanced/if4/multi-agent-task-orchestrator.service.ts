import { Injectable } from "@nestjs/common";
import {
  AgentTask,
  IntelligenceAgentDescriptor,
} from "../contracts/advanced-intelligence.contracts";
import { IntelligenceAgentRegistryService } from "./intelligence-agent-registry.service";

@Injectable()
export class MultiAgentTaskOrchestratorService {
  private readonly tasks: AgentTask[] = [];

  constructor(private readonly registry: IntelligenceAgentRegistryService) {}

  async execute(objective: string): Promise<Record<string, unknown>> {
    const agents = this.selectAgents(objective);
    const completed: AgentTask[] = [];

    for (const agent of agents) {
      const task = this.createTask(agent, objective);
      const result = await this.runTask(task, agent);
      completed.push(result);
      this.tasks.push(result);
    }

    const outputs = completed.map((task) => task.output ?? {});
    const confidence =
      completed.length === 0
        ? 0
        : Number(
            (
              completed.reduce(
                (sum, task) =>
                  sum +
                  Number(
                    (task.output as Record<string, unknown> | undefined)
                      ?.confidence ?? 0,
                  ),
                0,
              ) / completed.length
            ).toFixed(4),
          );

    return {
      id: `if4-multi-agent-run:${Date.now()}`,
      objective,
      agents: agents.map((agent) => agent.id),
      tasks: completed,
      outputs,
      confidence,
      status: completed.length > 0 ? "completed" : "blocked",
      completedAt: new Date().toISOString(),
    };
  }

  listTasks(limit = 100): readonly AgentTask[] {
    const normalized = Math.min(Math.max(limit, 1), 1000);
    return this.tasks.slice(-normalized).reverse();
  }

  private selectAgents(objective: string): IntelligenceAgentDescriptor[] {
    const normalized = objective.toLowerCase();
    const available = this.registry.available();

    const selected = available.filter((agent) =>
      agent.capabilities.some((capability) =>
        normalized.includes(capability.toLowerCase()),
      ),
    );

    const candidates: IntelligenceAgentDescriptor[] = [
      ...(selected.length > 0 ? selected : available),
    ];

    return candidates
      .sort(
        (
          a: IntelligenceAgentDescriptor,
          b: IntelligenceAgentDescriptor,
        ) => b.priority - a.priority,
      )
      .slice(0, 4);
  }

  private createTask(
    agent: IntelligenceAgentDescriptor,
    objective: string,
  ): AgentTask {
    return {
      id: `if4-task:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      objective,
      assignedAgentId: agent.id,
      status: "running",
      createdAt: new Date().toISOString(),
    };
  }

  private async runTask(
    task: AgentTask,
    agent: IntelligenceAgentDescriptor,
  ): Promise<AgentTask> {
    const confidence = Math.min(0.98, 0.65 + agent.priority / 500);

    return {
      ...task,
      status: "completed",
      output: {
        agentId: agent.id,
        role: agent.role,
        recommendation: `${agent.name} completed its role for "${task.objective}".`,
        confidence: Number(confidence.toFixed(4)),
      },
      completedAt: new Date().toISOString(),
    };
  }
}