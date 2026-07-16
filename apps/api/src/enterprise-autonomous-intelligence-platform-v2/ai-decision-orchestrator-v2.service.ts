import { Injectable } from "@nestjs/common";
import { AutonomousPlanningV2Service } from "./autonomous-planning-v2.service";
import type { IntelligenceDecisionV2 } from "./autonomous-intelligence-v2.types";

@Injectable()
export class AiDecisionOrchestratorV2Service {
  private readonly decisions: IntelligenceDecisionV2[] = [];

  constructor(private readonly plans: AutonomousPlanningV2Service) {}

  decide(
    planId: string,
    action: string,
    riskScore: number,
    confidence: number,
  ): IntelligenceDecisionV2 {
    this.plans.get(planId);

    const outcome: IntelligenceDecisionV2["outcome"] =
      riskScore >= 80 ? "DENY" : riskScore >= 50 ? "REVIEW" : "ALLOW";

    const decision: IntelligenceDecisionV2 = {
      id: `intelligence-decision-v2-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      planId,
      action,
      outcome,
      confidence,
      rationale: [
        `Risk score: ${riskScore}.`,
        `Confidence: ${confidence}.`,
        `Outcome: ${outcome}.`,
      ],
      createdAt: new Date().toISOString(),
    };

    this.decisions.unshift(decision);
    return this.clone(decision);
  }

  list(): IntelligenceDecisionV2[] {
    return this.decisions.map((decision) => this.clone(decision));
  }

  count(): number {
    return this.decisions.length;
  }

  private clone(decision: IntelligenceDecisionV2): IntelligenceDecisionV2 {
    return { ...decision, rationale: [...decision.rationale] };
  }
}
