import { Injectable } from "@nestjs/common";
import { UnifiedPlatformRegistryService } from "../registry/unified-platform-registry.service";
import { UnifiedWorkflowEngineService } from "../workflow/unified-workflow-engine.service";

@Injectable()
export class CrossSuiteIntelligenceService {
  constructor(
    private readonly registry: UnifiedPlatformRegistryService,
    private readonly workflows: UnifiedWorkflowEngineService
  ) {}

  analyze(objective: string) {
    const suites = this.registry.list("suite");
    const runs = this.workflows.listRuns();
    const confidence = Math.min(0.95, 0.65 + suites.length * 0.04 + Math.min(runs.length, 5) * 0.02);
    return {
      objective,
      analysis: "Cross-suite context consolidated.",
      recommendation: "Use unified orchestration with human approval for high-impact actions.",
      optimization: "Prefer registered operational services and reusable capabilities.",
      prediction: {
        readiness: confidence >= 0.8 ? "high" : "moderate",
        confidence
      },
      evidence: {
        activeSuites: suites.length,
        workflowRuns: runs.length
      },
      requiresHumanApproval: true,
      analyzedAt: new Date().toISOString()
    };
  }
}