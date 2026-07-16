import { Injectable } from "@nestjs/common";
import { BrainScenario } from "../enterprise-brain-mega-pack-4.types";
import { BrainLearningAuditService } from "../observability/brain-learning-audit.service";

@Injectable()
export class BrainScenarioSimulationService {
  private readonly scenarios = new Map<string, BrainScenario>();

  constructor(
    private readonly audit: BrainLearningAuditService
  ) {}

  list() {
    return Array.from(this.scenarios.values());
  }

  run(input: {
    name: string;
    baseline: Record<string, number>;
    assumptions: Record<string, number>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const outcomes: Record<string, number> = {};

    for (const [key, value] of Object.entries(input.baseline)) {
      const modifier = input.assumptions[key] ?? 0;
      outcomes[key] = Number((value * (1 + modifier / 100)).toFixed(2));
    }

    const values = Object.values(outcomes);
    const score =
      values.length === 0
        ? 0
        : Number(
            (
              values.reduce((sum, value) => sum + value, 0) /
              values.length
            ).toFixed(2)
          );

    const negativeAssumptions =
      Object.values(input.assumptions).filter((x) => x < 0);

    const riskScore = Math.min(
      100,
      negativeAssumptions.reduce(
        (sum, value) => sum + Math.abs(value),
        0
      )
    );

    const scenario: BrainScenario = {
      id: `brain-scenario:${Date.now()}:${this.scenarios.size + 1}`,
      name: input.name,
      baseline: input.baseline,
      assumptions: input.assumptions,
      outcomes,
      score,
      riskScore,
      recommendation:
        riskScore >= 60
          ? "Hold and mitigate risks before execution."
          : score > 0
            ? "Scenario is viable for governed review."
            : "Insufficient data for decision.",
      createdAt: new Date().toISOString()
    };

    this.scenarios.set(scenario.id, scenario);

    this.audit.record({
      correlationId: input.correlationId,
      category: "simulation",
      action: "brain-scenario-simulated",
      subjectId: scenario.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        riskScore >= 60
          ? "warning"
          : "success",
      metadata: {
        score,
        riskScore
      }
    });

    return scenario;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      highRisk: items.filter((x) => x.riskScore >= 60).length,
      averageScore:
        items.length === 0
          ? 0
          : Number(
              (
                items.reduce((sum, x) => sum + x.score, 0) /
                items.length
              ).toFixed(2)
            )
    };
  }
}
