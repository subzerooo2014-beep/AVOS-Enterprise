import {
  AgentTaskStatus,
  CollaborationAgent,
  CollaborationExecution,
  CollaborationPlan,
  CollaborationTask,
} from "./contracts";

export interface CollaborationAgentHandler {
  readonly agentKey: string;

  execute(
    task: CollaborationTask,
  ):
    | Promise<
        Record<string, unknown>
      >
    | Record<string, unknown>;
}

export class MultiAgentCollaborationExecutor {
  private readonly handlers =
    new Map<
      string,
      CollaborationAgentHandler
    >();

  register(
    handler:
      CollaborationAgentHandler,
    replace = false,
  ): void {
    if (
      this.handlers.has(
        handler.agentKey,
      ) &&
      !replace
    ) {
      throw new Error(
        `Agent handler already registered: ${handler.agentKey}`,
      );
    }

    this.handlers.set(
      handler.agentKey,
      handler,
    );
  }

  async execute(
    agents:
      readonly CollaborationAgent[],
    tasks:
      readonly CollaborationTask[],
    plan:
      CollaborationPlan,
  ): Promise<
    CollaborationExecution[]
  > {
    const agentsById =
      new Map(
        agents.map(
          (agent) => [
            agent.id,
            agent,
          ],
        ),
      );

    const tasksById =
      new Map(
        tasks.map(
          (task) => [
            task.id,
            task,
          ],
        ),
      );

    const executions:
      CollaborationExecution[] = [];

    for (
      const assignment of
      plan.assignments
    ) {
      const agent =
        agentsById.get(
          assignment.agentId,
        );

      const task =
        tasksById.get(
          assignment.taskId,
        );

      if (!agent || !task) {
        continue;
      }

      const handler =
        this.handlers.get(
          agent.key,
        );

      const startedAt =
        new Date();

      task.status =
        AgentTaskStatus.RUNNING;

      try {
        const output =
          handler
            ? await handler.execute(
                task,
              )
            : {};

        task.status =
          AgentTaskStatus.COMPLETED;

        executions.push({
          taskId:
            task.id,
          agentId:
            agent.id,
          success: true,
          output:
            output as Record<
              string,
              never
            >,
          findings: [],
          startedAt:
            startedAt.toISOString(),
          completedAt:
            new Date().toISOString(),
        });
      }
      catch {
        task.status =
          AgentTaskStatus.FAILED;

        executions.push({
          taskId:
            task.id,
          agentId:
            agent.id,
          success: false,
          output: {},
          findings: [],
          startedAt:
            startedAt.toISOString(),
          completedAt:
            new Date().toISOString(),
        });
      }
    }

    return executions;
  }
}
