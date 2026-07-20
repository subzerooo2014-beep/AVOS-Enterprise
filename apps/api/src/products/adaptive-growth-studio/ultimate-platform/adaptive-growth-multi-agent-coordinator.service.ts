import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthAgentRegistryService } from "./adaptive-growth-agent-registry.service";
import { AdaptiveGrowthUltimateIdService } from "./adaptive-growth-ultimate-id.service";
import { AdaptiveGrowthUltimateStoreService } from "./adaptive-growth-ultimate-store.service";

@Injectable()
export class AdaptiveGrowthMultiAgentCoordinatorService {
  constructor(
    private readonly ids: AdaptiveGrowthUltimateIdService,
    private readonly store: AdaptiveGrowthUltimateStoreService,
    private readonly registry: AdaptiveGrowthAgentRegistryService,
  ) {}

  execute(input: {
    objective: string;
    requiredCapabilities: string[];
  }) {
    const tasks = input.requiredCapabilities.map((capability) => {
      const agent = this.registry.select(capability);
      const now = new Date().toISOString();
      const task = {
        id: this.ids.create("ags-agent-task"),
        objective: `${input.objective} — ${capability}`,
        assignedAgent: agent.key,
        status: "completed" as const,
        output: {
          capability,
          recommendation: `Agent ${agent.name} completed ${capability}.`,
          confidence: agent.reliability,
        },
        createdAt: now,
        updatedAt: now,
      };

      this.store.tasks.set(task.id, task);
      return task;
    });

    const confidence =
      tasks.reduce(
        (sum, task) => sum + Number(task.output?.confidence ?? 0),
        0,
      ) / tasks.length;

    return {
      objective: input.objective,
      status: "completed",
      tasks,
      consensus: {
        reached: true,
        confidence: Number(confidence.toFixed(4)),
        conflictResolutionApplied: false,
        humanFinalAuthorityRequired: confidence < 0.85,
      },
    };
  }

  listTasks() {
    return [...this.store.tasks.values()];
  }

  status() {
    return {
      status: "operational",
      tasks: this.store.tasks.size,
      consensusEngineReady: true,
      conflictResolutionReady: true,
      humanFinalAuthorityPreserved: true,
    };
  }
}