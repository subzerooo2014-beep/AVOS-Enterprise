import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AeosDecision,
  AeosDecisionOption,
} from "./aeos.contracts";
import { EnterpriseGoalManagerService } from "./enterprise-goal-manager.service";

@Injectable()
export class MultiObjectiveDecisionEngineService {
  private readonly decisions: AeosDecision[] = [];

  constructor(private readonly goals: EnterpriseGoalManagerService) {}

  decide(
    goalId: string,
    options: AeosDecisionOption[],
  ): AeosDecision {
    const goal = this.goals.get(goalId);

    const rankedOptions = options
      .map((option) => {
        const objectiveScore = goal.objectives.reduce((sum, objective) => {
          const value = option.metrics[objective.key] ?? 0;
          const normalized =
            objective.direction === "maximize" ? value : 100 - value;
          return sum + normalized * objective.weight;
        }, 0);

        const totalWeight =
          goal.objectives.reduce((sum, objective) => sum + objective.weight, 0) ||
          1;

        const score =
          objectiveScore / totalWeight -
          option.risk * 0.2 -
          option.cost * 0.15 +
          option.reversibility * 0.1;

        return { ...option, score: Number(score.toFixed(4)) };
      })
      .sort((a, b) => b.score - a.score);

    const selected = rankedOptions[0];
    if (!selected) throw new Error("At least one decision option is required.");

    const requiresHumanApproval =
      selected.risk >= 60 ||
      selected.cost >= 60 ||
      selected.reversibility < 30;

    const confidence =
      rankedOptions.length === 1
        ? 0.65
        : Math.max(
            0.5,
            Math.min(
              0.99,
              0.7 + (selected.score - rankedOptions[1].score) / 100,
            ),
          );

    const decision: AeosDecision = {
      id: "aeos-decision:" + randomUUID(),
      goalId,
      selectedOptionId: selected.id,
      rankedOptions,
      requiresHumanApproval,
      confidence: Number(confidence.toFixed(4)),
      decidedAt: new Date().toISOString(),
    };

    this.decisions.unshift(decision);
    return decision;
  }

  list() {
    return this.decisions;
  }
}