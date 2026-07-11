import { randomUUID } from "node:crypto";
import {
  GenesisIntelligentPlan,
  GenesisPlanAction,
  GenesisPlanningInput,
  GenesisRecommendationType,
} from "./contracts";

export class AiGenesisGenerationPlanner {
  plan(
    input: GenesisPlanningInput,
  ): GenesisIntelligentPlan {
    const actions:
      GenesisPlanAction[] = [];

    let order = 10;

    for (
      const recommendation of
      input.optimization.recommendations
    ) {
      actions.push(
        this.action(
          `blueprint-${recommendation.type}-${recommendation.blueprintKey}`,
          `${this.title(recommendation.type)} ${recommendation.blueprintKey}`,
          recommendation.reasons.join(" "),
          order,
          [],
          recommendation.controls.length > 0,
          this.effortFor(
            recommendation.type,
          ),
          this.riskFor(
            recommendation.type,
          ),
          {
            blueprintKey:
              recommendation.blueprintKey,
            currentVersion:
              recommendation.currentVersion ?? null,
            targetVersion:
              recommendation.targetVersion ?? null,
          },
          [
            `blueprint:${recommendation.blueprintKey}`,
          ],
        ),
      );

      order += 10;
    }

    actions.push(
      this.action(
        "validate-dependencies",
        "Validate Cross-System Dependencies",
        "Validate dependency topology after blueprint optimization.",
        order,
        actions.map(
          (action) =>
            action.key,
        ),
        true,
        3,
        input.dependencyAnalysis.findings.length * 10,
        {
          cycleCount:
            input.dependencyAnalysis.cycles.length,
          missingDependencyCount:
            input.dependencyAnalysis.missingDependencies.length,
        },
        [
          "dependency-validation-report",
        ],
      ),
    );

    order += 10;

    actions.push(
      this.action(
        "run-autonomous-validation",
        "Run Autonomous Validation",
        "Execute governance, security, compatibility, and quality validation.",
        order,
        ["validate-dependencies"],
        true,
        4,
        20,
        {},
        [
          "autonomous-validation-report",
        ],
      ),
    );

    order += 10;

    actions.push(
      this.action(
        "synchronize-enterprise-knowledge",
        "Synchronize Enterprise Knowledge",
        "Register generation decisions and architecture knowledge.",
        order,
        ["run-autonomous-validation"],
        true,
        2,
        5,
        {},
        [
          "enterprise-knowledge-records",
        ],
      ),
    );

    const risks =
      input.dependencyAnalysis.findings.map(
        (finding) =>
          finding.message,
      );

    const score =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(
            input.optimization.scores.reduce(
              (total, scoreItem) =>
                total +
                scoreItem.total,
              0,
            ) /
              Math.max(
                1,
                input.optimization.scores.length,
              ) -
              risks.length * 5,
          ),
        ),
      );

    return {
      systemKey:
        input.systemKey,
      actions,
      rollbackActions:
        this.rollbackActions(actions),
      score,
      risks,
      generatedAt:
        new Date().toISOString(),
    };
  }

  private action(
    key: string,
    name: string,
    description: string,
    order: number,
    dependencies: string[],
    mandatory: boolean,
    estimatedEffort: number,
    riskScore: number,
    inputs:
      GenesisPlanAction["inputs"],
    expectedOutputs: string[],
  ): GenesisPlanAction {
    return {
      id: randomUUID(),
      key,
      name,
      description,
      order,
      dependencies,
      mandatory,
      estimatedEffort,
      riskScore:
        Math.max(
          0,
          Math.min(
            100,
            riskScore,
          ),
        ),
      inputs,
      expectedOutputs,
    };
  }

  private rollbackActions(
    actions:
      readonly GenesisPlanAction[],
  ): GenesisPlanAction[] {
    return [...actions]
      .reverse()
      .map(
        (action, index) =>
          this.action(
            `rollback-${action.key}`,
            `Rollback ${action.name}`,
            `Reverse action ${action.key}.`,
            (index + 1) * 10,
            index === 0
              ? []
              : [
                  `rollback-${actions[
                    actions.length - index
                  ]?.key ?? ""}`,
                ].filter(Boolean),
            true,
            Math.max(
              1,
              action.estimatedEffort,
            ),
            action.riskScore,
            action.inputs,
            [
              `rollback:${action.key}`,
            ],
          ),
      );
  }

  private title(
    type: GenesisRecommendationType,
  ): string {
    return type
      .split("_")
      .map(
        (part) =>
          part.charAt(0).toUpperCase() +
          part.slice(1),
      )
      .join(" ");
  }

  private effortFor(
    type: GenesisRecommendationType,
  ): number {
    switch (type) {
      case GenesisRecommendationType.KEEP:
        return 1;
      case GenesisRecommendationType.ADD:
        return 4;
      case GenesisRecommendationType.REMOVE:
        return 3;
      case GenesisRecommendationType.REPLACE:
        return 7;
      case GenesisRecommendationType.UPGRADE:
        return 5;
      case GenesisRecommendationType.ISOLATE:
        return 6;
      case GenesisRecommendationType.DEFER:
        return 1;
    }
  }

  private riskFor(
    type: GenesisRecommendationType,
  ): number {
    switch (type) {
      case GenesisRecommendationType.KEEP:
        return 5;
      case GenesisRecommendationType.ADD:
        return 25;
      case GenesisRecommendationType.REMOVE:
        return 35;
      case GenesisRecommendationType.REPLACE:
        return 60;
      case GenesisRecommendationType.UPGRADE:
        return 40;
      case GenesisRecommendationType.ISOLATE:
        return 45;
      case GenesisRecommendationType.DEFER:
        return 10;
    }
  }
}
