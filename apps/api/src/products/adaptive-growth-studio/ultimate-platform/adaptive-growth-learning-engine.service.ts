import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthUltimateIdService } from "./adaptive-growth-ultimate-id.service";
import { AdaptiveGrowthUltimateStoreService } from "./adaptive-growth-ultimate-store.service";
import { AdaptiveGrowthWorkflowEngineService } from "./adaptive-growth-workflow-engine.service";

@Injectable()
export class AdaptiveGrowthLearningEngineService {
  constructor(
    private readonly ids: AdaptiveGrowthUltimateIdService,
    private readonly store: AdaptiveGrowthUltimateStoreService,
    private readonly workflows: AdaptiveGrowthWorkflowEngineService,
  ) {}

  learn(workflowId: string) {
    const workflow = this.workflows.get(workflowId);
    const success = workflow.state === "completed";
    const score = success ? 0.9 : workflow.state === "compensated" ? 0.55 : 0.25;

    const outcome = {
      id: this.ids.create("ags-learning-outcome"),
      workflowId,
      objective: workflow.objective,
      success,
      score,
      observations: [
        `Workflow state: ${workflow.state}`,
        `Completed steps: ${workflow.completedSteps.length}/${workflow.steps.length}`,
        `Risk level: ${workflow.riskLevel}`,
      ],
      recommendations: success
        ? [
            "Reuse the successful workflow pattern.",
            "Increase controlled automation where policy permits.",
          ]
        : [
            "Review failed step and evidence.",
            "Adjust strategy parameters before retry.",
            "Preserve Human Final Authority for elevated-risk changes.",
          ],
      createdAt: new Date().toISOString(),
    };

    this.store.outcomes.set(outcome.id, outcome);
    return outcome;
  }

  list() {
    return [...this.store.outcomes.values()];
  }

  status() {
    return {
      status: "operational",
      outcomes: this.store.outcomes.size,
      feedbackLoopReady: true,
      patternDiscoveryReady: true,
    };
  }
}