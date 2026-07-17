import { Injectable } from "@nestjs/common";
import { DecisionRecommendation, DecisionRuleResult, DecisionSimulationResult } from "../contracts/enterprise-decision-intelligence.contracts";

@Injectable()
export class EnterpriseDecisionRecommendationService {
  rank(simulations: DecisionSimulationResult[], ruleResult: DecisionRuleResult): DecisionRecommendation[] {
    return [...simulations].sort((a, b) => b.projectedScore - a.projectedScore).map((simulation, index) => ({
      rank: index + 1,
      optionId: simulation.optionId,
      score: simulation.projectedScore + ruleResult.scoreAdjustment,
      confidence: Math.max(0, Math.min(100, Math.round(100 - simulation.projectedRisk / 2))),
      reasons: [`Projected score: ${simulation.projectedScore}.`, `Rule adjustment: ${ruleResult.scoreAdjustment}.`, `Projected risk: ${simulation.projectedRisk}.`]
    }));
  }
}