import { UltraDFinding, UltraDSeverity, UltraDValue } from "./contracts";

export interface StrategicObjective {
  key: string;
  description: string;
  priority: number;
  targetScore: number;
  dependencies: string[];
}

export interface StrategicScenario {
  key: string;
  probability: number;
  impact: number;
  assumptions: Record<string, UltraDValue>;
}

export interface StrategicInitiative {
  key: string;
  objectiveKey: string;
  sequence: number;
  expectedValue: number;
  risk: number;
  controls: string[];
}

export interface StrategicPlan {
  systemKey: string;
  initiatives: StrategicInitiative[];
  score: number;
  findings: UltraDFinding[];
  generatedAt: string;
}

export class AiStrategicPlanner {
  plan(
    systemKey: string,
    objectives: readonly StrategicObjective[],
    scenarios: readonly StrategicScenario[],
  ): StrategicPlan {
    const findings: UltraDFinding[] = [];
    const initiatives = objectives
      .map((objective, index): StrategicInitiative => {
        const scenarioRisk =
          scenarios.length === 0
            ? 20
            : Math.round(
                scenarios.reduce(
                  (sum, scenario) =>
                    sum +
                    (scenario.probability * scenario.impact) / 100,
                  0,
                ) / scenarios.length,
              );

        if (objective.dependencies.includes(objective.key)) {
          findings.push({
            code: "STRATEGIC_SELF_DEPENDENCY",
            severity: UltraDSeverity.ERROR,
            message: `Objective ${objective.key} depends on itself.`,
            subject: objective.key,
            metadata: {},
          });
        }

        return {
          key: `initiative-${objective.key}`,
          objectiveKey: objective.key,
          sequence: index + 1,
          expectedValue: Math.max(
            0,
            Math.min(100, Math.round(objective.priority * 0.6 + objective.targetScore * 0.4)),
          ),
          risk: Math.max(0, Math.min(100, scenarioRisk)),
          controls:
            scenarioRisk >= 60
              ? ["executive-approval", "staged-rollout", "rollback-plan"]
              : scenarioRisk >= 35
                ? ["progressive-delivery", "continuous-monitoring"]
                : ["standard-observability"],
        };
      })
      .sort(
        (left, right) =>
          right.expectedValue - right.risk - (left.expectedValue - left.risk),
      )
      .map((initiative, index) => ({ ...initiative, sequence: index + 1 }));

    const score =
      initiatives.length === 0
        ? 0
        : Math.round(
            initiatives.reduce(
              (sum, initiative) => sum + initiative.expectedValue - initiative.risk * 0.35,
              0,
            ) / initiatives.length,
          );

    return {
      systemKey,
      initiatives,
      score: Math.max(0, Math.min(100, score)),
      findings,
      generatedAt: new Date().toISOString(),
    };
  }
}
