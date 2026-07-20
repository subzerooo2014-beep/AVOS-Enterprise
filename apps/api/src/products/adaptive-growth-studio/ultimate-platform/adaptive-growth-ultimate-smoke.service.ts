import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthLearningEngineService } from "./adaptive-growth-learning-engine.service";
import { AdaptiveGrowthMultiAgentCoordinatorService } from "./adaptive-growth-multi-agent-coordinator.service";
import { AdaptiveGrowthStrategyOptimizerService } from "./adaptive-growth-strategy-optimizer.service";
import { AdaptiveGrowthWorkflowEngineService } from "./adaptive-growth-workflow-engine.service";

@Injectable()
export class AdaptiveGrowthUltimateSmokeService {
  private latest: Record<string, unknown> | undefined;

  constructor(
    private readonly workflows: AdaptiveGrowthWorkflowEngineService,
    private readonly learning: AdaptiveGrowthLearningEngineService,
    private readonly optimizer: AdaptiveGrowthStrategyOptimizerService,
    private readonly agents: AdaptiveGrowthMultiAgentCoordinatorService,
  ) {}

  run() {
    const workflow = this.workflows.create({
      name: "AGS Ultimate Smoke Workflow",
      objective: "Validate orchestration, workflow execution, learning and multi-agent collaboration.",
      riskLevel: "medium",
      requestedBy: "human:khalifa",
      steps: [
        {
          key: "knowledge",
          capabilityKey: "knowledge-fabric",
          operation: "retrieve",
          payload: { smoke: true },
        },
        {
          key: "reason",
          capabilityKey: "intelligence-fabric",
          operation: "reason",
          payload: { smoke: true },
        },
        {
          key: "coordinate",
          capabilityKey: "enterprise-nervous-system",
          operation: "route",
          payload: { smoke: true },
        },
      ],
    });

    const completed = this.workflows.run(workflow.id);
    const outcome = this.learning.learn(workflow.id);
    const strategy = this.optimizer.optimize("ags-ultimate-smoke", { smokeValidated: true });
    const team = this.agents.execute({
      objective: "Validate AGS autonomous growth team",
      requiredCapabilities: ["plan", "analyze", "evaluate-risk", "coordinate"],
    });

    const checks = {
      workflowCompleted: completed.state === "completed",
      learningCaptured: outcome.success,
      strategyOptimized: strategy.version >= 1,
      multiAgentCompleted: team.status === "completed",
      consensusReached: team.consensus.reached,
    };

    const score =
      (Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100;

    this.latest = {
      id: `ags-ultimate-smoke:${Date.now()}`,
      status: score === 100 ? "passed" : "failed",
      score,
      checks,
      workflowId: workflow.id,
      outcomeId: outcome.id,
      strategyKey: strategy.key,
      agentTasks: team.tasks.length,
      executedAt: new Date().toISOString(),
    };

    return this.latest;
  }

  status() {
    return this.latest ?? { status: "not-run" };
  }
}