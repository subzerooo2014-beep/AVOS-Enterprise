import { Injectable } from "@nestjs/common";
import { UnifiedIntelligenceOrchestratorService } from "../orchestrator/unified-intelligence-orchestrator.service";

@Injectable()
export class IntelligenceOrchestrationSmokeService {
  constructor(
    private readonly orchestrator: UnifiedIntelligenceOrchestratorService,
  ) {}

  async run(): Promise<Record<string, unknown>> {
    const decision = await this.orchestrator.execute({
      objective:
        "Analyze vehicle marketplace sales opportunity with finance risk",
      domain: "vehicles",
      capability: "vehicle-analysis",
      constraints: [
        "human approval for production execution",
      ],
      evidence: [
        {
          id: `if2-smoke:${Date.now()}:1`,
          source: "knowledge-fabric",
          title: "Vehicle marketplace evidence",
          content: "Vehicle demand and sales context available.",
          trustScore: 1,
        },
        {
          id: `if2-smoke:${Date.now()}:2`,
          source: "finance-intelligence",
          title: "Finance risk evidence",
          content: "Finance risk is within controlled limits.",
          trustScore: 0.9,
        },
      ],
    });

    const checks = {
      decisionCreated: decision.id.length > 0,
      engineSelected: decision.selectedEngines.length > 0,
      engineResultsCreated: decision.engineResults.length > 0,
      recommendationCreated: decision.recommendation.length > 0,
      confidenceValid:
        decision.confidence >= 0 && decision.confidence <= 1,
      humanApprovalEvaluated:
        typeof decision.requiresHumanApproval === "boolean",
    };

    const passed = Object.values(checks).every(Boolean);

    return {
      id: `intelligence-fabric-if2-smoke:${Date.now()}`,
      status: passed ? "passed" : "failed",
      score: Math.round(
        (Object.values(checks).filter(Boolean).length /
          Object.values(checks).length) *
          100,
      ),
      checks,
      decisionPreview: {
        id: decision.id,
        selectedEngines: decision.selectedEngines,
        confidence: decision.confidence,
        requiresHumanApproval: decision.requiresHumanApproval,
        recommendation: decision.recommendation,
      },
      testedAt: new Date().toISOString(),
    };
  }
}