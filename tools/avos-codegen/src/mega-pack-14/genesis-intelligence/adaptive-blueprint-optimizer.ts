import {
  GenesisBlueprintRecommendation,
  GenesisBlueprintRequirement,
  GenesisOptimizationContext,
  GenesisOptimizationResult,
  GenesisRecommendationType,
} from "./contracts";
import {
  GenesisBlueprintScoreEngine,
} from "./blueprint-score-engine";

export class AdaptiveGenesisBlueprintOptimizer {
  constructor(
    readonly scores =
      new GenesisBlueprintScoreEngine(),
  ) {}

  optimize(
    context: GenesisOptimizationContext,
  ): GenesisOptimizationResult {
    const scored =
      context.candidates
        .map((candidate) => ({
          candidate,
          score:
            this.scores.score(
              candidate,
              context.requirements,
            ),
        }))
        .sort(
          (left, right) =>
            right.score.total -
            left.score.total,
        );

    const selected = this.select(
      context.requirements,
      scored,
    );

    const unresolvedCapabilities =
      context.requirements
        .filter(
          (requirement) =>
            requirement.required,
        )
        .filter(
          (requirement) =>
            !selected.some(
              (candidate) =>
                candidate.capabilities.includes(
                  requirement.capability,
                ),
            ),
        )
        .map(
          (requirement) =>
            requirement.capability,
        );

    const recommendations =
      this.recommend(
        context,
        selected,
        scored,
      );

    return {
      systemKey: context.systemKey,
      successful:
        unresolvedCapabilities.length === 0,
      scores:
        scored.map(
          (item) =>
            item.score,
        ),
      recommendations,
      selectedBlueprints:
        selected.map(
          (item) =>
            structuredClone(item),
        ),
      unresolvedCapabilities,
      generatedAt:
        new Date().toISOString(),
    };
  }

  private select(
    requirements:
      readonly GenesisBlueprintRequirement[],
    scored:
      readonly {
        candidate: GenesisOptimizationContext["candidates"][number];
        score: ReturnType<
          GenesisBlueprintScoreEngine["score"]
        >;
      }[],
  ): GenesisOptimizationContext["candidates"] {
    const selected =
      new Map<
        string,
        GenesisOptimizationContext["candidates"][number]
      >();

    for (
      const requirement of
      requirements
        .filter(
          (item) =>
            item.required,
        )
        .sort(
          (left, right) =>
            right.priority -
            left.priority,
        )
    ) {
      const best =
        scored.find(
          (item) =>
            item.candidate.capabilities.includes(
              requirement.capability,
            ) &&
            !requirement.excludedProviders.includes(
              item.candidate.key,
            ),
        );

      if (best) {
        selected.set(
          best.candidate.key,
          best.candidate,
        );
      }
    }

    return Array.from(
      selected.values(),
    );
  }

  private recommend(
    context: GenesisOptimizationContext,
    selected:
      readonly GenesisOptimizationContext["candidates"][number][],
    scored:
      readonly {
        candidate: GenesisOptimizationContext["candidates"][number];
        score: ReturnType<
          GenesisBlueprintScoreEngine["score"]
        >;
      }[],
  ): GenesisBlueprintRecommendation[] {
    const selectedKeys =
      new Set(
        selected.map(
          (item) =>
            item.key,
        ),
      );

    const currentByKey =
      new Map(
        context.currentBlueprints.map(
          (item) => [
            item.key,
            item,
          ],
        ),
      );

    const recommendations:
      GenesisBlueprintRecommendation[] = [];

    for (const item of scored) {
      const current =
        currentByKey.get(
          item.candidate.key,
        );

      if (
        selectedKeys.has(
          item.candidate.key,
        )
      ) {
        if (!current) {
          recommendations.push({
            type:
              GenesisRecommendationType.ADD,
            blueprintKey:
              item.candidate.key,
            targetVersion:
              item.candidate.version,
            score:
              item.score.total,
            reasons: [
              "Selected as a capability provider.",
              ...item.score.reasons,
            ],
            controls: [],
          });
        }
        else if (
          current.version !==
          item.candidate.version
        ) {
          recommendations.push({
            type:
              GenesisRecommendationType.UPGRADE,
            blueprintKey:
              item.candidate.key,
            currentVersion:
              current.version,
            targetVersion:
              item.candidate.version,
            score:
              item.score.total,
            reasons: [
              "A better compatible version is available.",
            ],
            controls: [
              "compatibility-check",
              "rollback-plan",
            ],
          });
        }
        else {
          recommendations.push({
            type:
              GenesisRecommendationType.KEEP,
            blueprintKey:
              item.candidate.key,
            currentVersion:
              current.version,
            targetVersion:
              item.candidate.version,
            score:
              item.score.total,
            reasons: [
              "Current blueprint remains optimal.",
            ],
            controls: [],
          });
        }
      }
    }

    for (
      const current of
      context.currentBlueprints
    ) {
      if (
        !selectedKeys.has(
          current.key,
        )
      ) {
        recommendations.push({
          type:
            GenesisRecommendationType.REMOVE,
          blueprintKey:
            current.key,
          currentVersion:
            current.version,
          score: 0,
          reasons: [
            "Blueprint is no longer required by the optimized composition.",
          ],
          controls: [
            "dependency-impact-check",
          ],
        });
      }
    }

    return recommendations;
  }
}
