import { randomUUID } from "node:crypto";

export interface FabricNode {
  key: string;
  environment: "local" | "cloud" | "edge" | "hybrid";
  capabilities: string[];
  capacity: number;
  currentLoad: number;
}

export interface FabricTask {
  key: string;
  requiredCapability: string;
  workload: number;
  dependencies: string[];
}

export interface FabricRoute {
  id: string;
  taskKey: string;
  nodeKey: string;
  environment: string;
  routeScore: number;
}

export interface GlobalOrchestrationFabricResult {
  routes: FabricRoute[];
  unroutedTasks: string[];
  environmentsUsed: string[];
  routedAt: string;
}

export class GlobalOrchestrationFabric {
  route(
    nodes: readonly FabricNode[],
    tasks: readonly FabricTask[],
  ): GlobalOrchestrationFabricResult {
    const routes: FabricRoute[] = [];
    const unroutedTasks: string[] = [];

    for (const task of tasks) {
      const candidate = nodes
        .filter(
          (node) =>
            node.capabilities.includes(task.requiredCapability) &&
            node.capacity - node.currentLoad >= task.workload,
        )
        .map((node) => ({
          node,
          score: Math.round(
            (node.capacity - node.currentLoad) * 0.7 +
              (node.environment === "hybrid" ? 20 : 10),
          ),
        }))
        .sort((a, b) => b.score - a.score)[0];

      if (!candidate) {
        unroutedTasks.push(task.key);
        continue;
      }

      routes.push({
        id: randomUUID(),
        taskKey: task.key,
        nodeKey: candidate.node.key,
        environment: candidate.node.environment,
        routeScore: candidate.score,
      });
    }

    return {
      routes,
      unroutedTasks,
      environmentsUsed: Array.from(
        new Set(routes.map((route) => route.environment)),
      ),
      routedAt: new Date().toISOString(),
    };
  }
}
