import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  DecisionRecord,
  DecisionScenarioRecord,
  RecommendationRecord,
} from "./enterprise-intelligence-command.types";

@Injectable()
export class DecisionIntelligenceService {
  private readonly decisions = new Map<string, DecisionRecord>();
  private readonly scenarios: DecisionScenarioRecord[] = [];
  private readonly recommendations: RecommendationRecord[] = [];

  create(
    input: Omit<DecisionRecord, "createdAt" | "updatedAt">,
  ): DecisionRecord {
    const now = new Date().toISOString();

    const decision: DecisionRecord = {
      ...input,
      options: [...input.options],
      createdAt: now,
      updatedAt: now,
    };

    this.decisions.set(decision.id, decision);
    return this.cloneDecision(decision);
  }

  addScenario(
    decisionId: string,
    name: string,
    assumptions: Record<string, unknown>,
    score: number,
    impact: number,
    risk: number,
  ): DecisionScenarioRecord {
    this.requireDecision(decisionId);

    const scenario: DecisionScenarioRecord = {
      id: `scenario-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      decisionId,
      name,
      assumptions: { ...assumptions },
      score,
      impact,
      risk,
      createdAt: new Date().toISOString(),
    };

    this.scenarios.unshift(scenario);
    return this.cloneScenario(scenario);
  }

  recommend(decisionId: string): RecommendationRecord[] {
    const decision = this.requireDecision(decisionId);
    const scenarios = this.scenarios
      .filter((item) => item.decisionId === decisionId)
      .sort((a, b) => b.score + b.impact - b.risk - (a.score + a.impact - a.risk));

    const generated = decision.options.map((option, index) => {
      const scenario = scenarios[index] ?? scenarios[0];
      const score = scenario
        ? Math.max(0, Math.min(100, scenario.score + scenario.impact - scenario.risk))
        : 50;

      const recommendation: RecommendationRecord = {
        id: `recommendation-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 10)}-${index}`,
        decisionId,
        option,
        score,
        reasons: scenario
          ? [
              `Scenario '${scenario.name}' score: ${scenario.score}.`,
              `Impact: ${scenario.impact}.`,
              `Risk: ${scenario.risk}.`,
            ]
          : ["No scenario evidence was available; neutral score applied."],
        createdAt: new Date().toISOString(),
      };

      this.recommendations.unshift(recommendation);
      return this.cloneRecommendation(recommendation);
    });

    return generated.sort((a, b) => b.score - a.score);
  }

  approve(
    id: string,
    selectedOption: string,
    confidence: number,
    rationale: string,
  ): DecisionRecord {
    const decision = this.requireDecision(id);
    decision.status = "APPROVED";
    decision.selectedOption = selectedOption;
    decision.confidence = confidence;
    decision.rationale = rationale;
    decision.updatedAt = new Date().toISOString();
    return this.cloneDecision(decision);
  }

  listDecisions(): DecisionRecord[] {
    return Array.from(this.decisions.values()).map((item) =>
      this.cloneDecision(item),
    );
  }

  listScenarios(): DecisionScenarioRecord[] {
    return this.scenarios.map((item) => this.cloneScenario(item));
  }

  listRecommendations(): RecommendationRecord[] {
    return this.recommendations.map((item) =>
      this.cloneRecommendation(item),
    );
  }

  decisionCount(): number {
    return this.decisions.size;
  }

  approvedCount(): number {
    return this.listDecisions().filter((item) => item.status === "APPROVED")
      .length;
  }

  scenarioCount(): number {
    return this.scenarios.length;
  }

  recommendationCount(): number {
    return this.recommendations.length;
  }

  private requireDecision(id: string): DecisionRecord {
    const decision = this.decisions.get(id);

    if (!decision) {
      throw new NotFoundException(`Decision '${id}' was not found.`);
    }

    return decision;
  }

  private cloneDecision(item: DecisionRecord): DecisionRecord {
    return { ...item, options: [...item.options] };
  }

  private cloneScenario(item: DecisionScenarioRecord): DecisionScenarioRecord {
    return { ...item, assumptions: { ...item.assumptions } };
  }

  private cloneRecommendation(item: RecommendationRecord): RecommendationRecord {
    return { ...item, reasons: [...item.reasons] };
  }
}
