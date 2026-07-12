export interface AgentCapability {
  agentKey: string;
  capabilities: string[];
  reliability: number;
  currentLoad: number;
}

export interface AgentTask {
  key: string;
  requiredCapability: string;
  priority: number;
  dependencies: string[];
}

export interface AgentAssignment {
  taskKey: string;
  agentKey: string;
  score: number;
}

export interface AgentCoordinationResult {
  assignments: AgentAssignment[];
  unassignedTasks: string[];
  conflictsResolved: number;
  coordinatedAt: string;
}

export class MultiAgentCoordinator {
  coordinate(
    agents: readonly AgentCapability[],
    tasks: readonly AgentTask[],
  ): AgentCoordinationResult {
    const assignments: AgentAssignment[] = [];
    const unassignedTasks: string[] = [];
    let conflictsResolved = 0;

    for (const task of [...tasks].sort((a, b) => b.priority - a.priority)) {
      const candidates = agents
        .filter((agent) =>
          agent.capabilities.includes(task.requiredCapability),
        )
        .map((agent) => ({
          agent,
          score: Math.round(
            agent.reliability * 0.7 + (100 - agent.currentLoad) * 0.3,
          ),
        }))
        .sort((a, b) => b.score - a.score);

      const best = candidates[0];

      if (!best) {
        unassignedTasks.push(task.key);
        continue;
      }

      if (candidates.length > 1) conflictsResolved += 1;

      assignments.push({
        taskKey: task.key,
        agentKey: best.agent.agentKey,
        score: best.score,
      });
    }

    return {
      assignments,
      unassignedTasks,
      conflictsResolved,
      coordinatedAt: new Date().toISOString(),
    };
  }
}
