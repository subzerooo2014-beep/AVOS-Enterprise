import { Injectable } from "@nestjs/common";
import { DecisionCaseRegistryV2Service } from "./decision-case-registry-v2.service";
import type {
  DecisionRecommendationV2,
  DecisionScenarioV2,
} from "./enterprise-decision-intelligence-v2.types";

@Injectable()
export class DecisionScenarioEngineV2Service {
  private readonly scenarios: DecisionScenarioV2[] = [];
  private readonly recommendations: DecisionRecommendationV2[] = [];

  constructor(private readonly decisions: DecisionCaseRegistryV2Service) {}

  addScenario(
    decisionId: string,
    name: string,
    assumptions: Record<string, unknown>,
    benefitScore: number,
    riskScore: number,
    costScore: number,
    feasibilityScore: number,
  ): DecisionScenarioV2 {
    this.decisions.get(decisionId);

    const scenario: DecisionScenarioV2 = {
      id: `decision-scenario-v2-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      decisionId,
      name,
      assumptions: { ...assumptions },
      benefitScore,
      riskScore,
      costScore,
      feasibilityScore,
      createdAt: new Date().toISOString(),
    };

    this.scenarios.unshift(scenario);
    return this.cloneScenario(scenario);
  }

  recommend(decisionId: string): DecisionRecommendationV2[] {
    const decision = this.decisions.get(decisionId);
    const scenarios = this.scenarios.filter((item) => item.decisionId === decisionId);

    const generated = decision.options.map((option, index) => {
      const scenario = scenarios[index] ?? scenarios[0];
      const totalScore = scenario
        ? Math.max(
            0,
            Math.min(
              100,
              scenario.benefitScore +
                scenario.feasibilityScore -
                scenario.riskScore -
                scenario.costScore,
            ),
          )
        : 50;

      const recommendation: DecisionRecommendationV2 = {
        id: `decision-recommendation-v2-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 10)}-${index}`,
        decisionId,
        option,
        totalScore,
        reasons: scenario
          ? [
              `Benefit score: ${scenario.benefitScore}.`,
              `Risk score: ${scenario.riskScore}.`,
              `Cost score: ${scenario.costScore}.`,
              `Feasibility score: ${scenario.feasibilityScore}.`,
            ]
          : ["No scenario evidence was available."],
        createdAt: new Date().toISOString(),
      };

      this.recommendations.unshift(recommendation);
      return this.cloneRecommendation(recommendation);
    });

    return generated.sort((a, b) => b.totalScore - a.totalScore);
  }

  scenariosList(): DecisionScenarioV2[] {
    return this.scenarios.map((item) => this.cloneScenario(item));
  }

  recommendationsList(): DecisionRecommendationV2[] {
    return this.recommendations.map((item) => this.cloneRecommendation(item));
  }

  scenarioCount(): number {
    return this.scenarios.length;
  }

  recommendationCount(): number {
    return this.recommendations.length;
  }

  private cloneScenario(item: DecisionScenarioV2): DecisionScenarioV2 {
    return { ...item, assumptions: { ...item.assumptions } };
  }

  private cloneRecommendation(
    item: DecisionRecommendationV2,
  ): DecisionRecommendationV2 {
    return { ...item, reasons: [...item.reasons] };
  }
}
