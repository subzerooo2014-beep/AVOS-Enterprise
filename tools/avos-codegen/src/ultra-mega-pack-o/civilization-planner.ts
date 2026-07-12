export interface CivilizationObjective {
  key: string;
  horizon: "near" | "mid" | "long";
  impact: number;
  readiness: number;
  resilience: number;
  dependencies: string[];
}

export interface CivilizationPlanItem {
  key: string;
  horizon: string;
  score: number;
  sequence: number;
}

export interface StrategicCivilizationPlan {
  items: CivilizationPlanItem[];
  planScore: number;
  generatedAt: string;
}

export class StrategicCivilizationPlanner {
  plan(objectives: readonly CivilizationObjective[]): StrategicCivilizationPlan {
    const items = objectives
      .map((objective) => ({
        key: objective.key,
        horizon: objective.horizon,
        score: Math.round(
          objective.impact * 0.4 +
            objective.readiness * 0.35 +
            objective.resilience * 0.25 -
            objective.dependencies.length * 2,
        ),
        sequence: 0,
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, sequence: index + 1 }));

    return {
      items,
      planScore:
        items.length === 0
          ? 100
          : Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length),
      generatedAt: new Date().toISOString(),
    };
  }
}
