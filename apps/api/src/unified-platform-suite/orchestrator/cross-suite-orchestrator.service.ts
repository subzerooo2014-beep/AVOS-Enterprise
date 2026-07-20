import { Injectable } from "@nestjs/common";
import { WorkflowDefinition } from "../contracts/unified-platform.types";
import { UnifiedWorkflowEngineService } from "../workflow/unified-workflow-engine.service";

@Injectable()
export class CrossSuiteOrchestratorService {
  constructor(private readonly workflows: UnifiedWorkflowEngineService) {}

  orchestrate(objective: string, requiresHumanApproval = true) {
    const workflow: WorkflowDefinition = {
      id: `cross-suite-${Date.now()}`,
      name: objective,
      mode: "distributed",
      steps: [
        { id: "marketplace", suite: "marketplace", action: "collect-marketplace-context" },
        { id: "finance", suite: "finance", action: "evaluate-financial-context", dependsOn: ["marketplace"] },
        { id: "media", suite: "media", action: "evaluate-media-opportunity", dependsOn: ["finance"] },
        { id: "brain", suite: "enterprise-brain", action: "synthesize-enterprise-decision", dependsOn: ["media"] },
        {
          id: "global-intelligence",
          suite: "global-intelligence",
          action: "validate-global-intelligence",
          dependsOn: ["brain"],
          requiresHumanApproval
        }
      ]
    };
    return this.workflows.run(workflow, { objective });
  }
}