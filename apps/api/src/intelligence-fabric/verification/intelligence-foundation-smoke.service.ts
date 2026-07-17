import { Injectable } from "@nestjs/common";
import { IntelligenceOrchestratorService } from "../orchestrator/intelligence-orchestrator.service";

@Injectable()
export class IntelligenceFoundationSmokeService {
  constructor(
    private readonly orchestrator: IntelligenceOrchestratorService,
  ) {}

  async run(): Promise<Record<string, unknown>> {
    const decision = await this.orchestrator.execute({
      objective: "Evaluate production intelligence readiness",
      signals: [
        {
          id: `smoke:${Date.now()}:1`,
          type: "readiness",
          source: "if-1-smoke",
          value: 100,
          confidence: 1,
          observedAt: new Date().toISOString(),
        },
      ],
      constraints: ["human approval for critical decisions"],
    });

    const checks = {
      decisionCreated: decision.id.length > 0,
      recommendationCreated: decision.recommendation.length > 0,
      insightCreated: decision.insights.length > 0,
      approvalPolicyEvaluated:
        typeof decision.requiresHumanApproval === "boolean",
    };

    const passed = Object.values(checks).every(Boolean);

    return {
      id: `intelligence-fabric-if1-smoke:${Date.now()}`,
      status: passed ? "passed" : "failed",
      score: Math.round(
        (Object.values(checks).filter(Boolean).length /
          Object.values(checks).length) *
          100,
      ),
      checks,
      decision,
      testedAt: new Date().toISOString(),
    };
  }
}