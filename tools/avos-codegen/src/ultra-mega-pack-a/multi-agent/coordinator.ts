import {
  CollaborationAgent,
  CollaborationPlan,
  CollaborationTask,
} from "./contracts";

export class MultiAgentCollaborationCoordinator {
  plan(
    agents:
      readonly CollaborationAgent[],
    tasks:
      readonly CollaborationTask[],
  ): CollaborationPlan {
    const usage =
      new Map(
        agents.map(
          (agent) => [
            agent.id,
            agent.activeTasks,
          ],
        ),
      );

    const assignments:
      CollaborationPlan["assignments"] =
      [];

    const unassignedTasks:
      string[] = [];

    const ordered =
      [...tasks].sort(
        (left, right) =>
          right.priority -
          left.priority,
      );

    for (const task of ordered) {
      const eligible =
        agents
          .filter(
            (agent) =>
              task.requiredCapabilities.every(
                (capability) =>
                  agent.capabilities.includes(
                    capability,
                  ),
              ),
          )
          .filter(
            (agent) =>
              (usage.get(agent.id) ?? 0) <
              agent.capacity,
          )
          .sort(
            (left, right) =>
              (usage.get(left.id) ?? 0) -
              (usage.get(right.id) ?? 0),
          );

      const selected =
        eligible[0];

      if (!selected) {
        unassignedTasks.push(
          task.id,
        );
        continue;
      }

      assignments.push({
        taskId: task.id,
        agentId:
          selected.id,
      });

      usage.set(
        selected.id,
        (usage.get(selected.id) ?? 0) +
          1,
      );
    }

    return {
      assignments,
      unassignedTasks,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
