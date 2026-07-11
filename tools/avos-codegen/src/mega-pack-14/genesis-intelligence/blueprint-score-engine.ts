import {
  GenesisBlueprintCandidate,
  GenesisBlueprintRequirement,
  GenesisBlueprintScore,
} from "./contracts";

export class GenesisBlueprintScoreEngine {
  score(
    candidate: GenesisBlueprintCandidate,
    requirements:
      readonly GenesisBlueprintRequirement[],
  ): GenesisBlueprintScore {
    const coveredRequired =
      requirements.filter(
        (requirement) =>
          requirement.required &&
          candidate.capabilities.includes(
            requirement.capability,
          ),
      );

    const requiredCount =
      requirements.filter(
        (requirement) =>
          requirement.required,
      ).length;

    const capabilityCoverage =
      requiredCount === 0
        ? 100
        : Math.round(
            (
              coveredRequired.length /
              requiredCount
            ) * 100,
          );

    let penalties = 0;
    const reasons: string[] = [];

    for (const requirement of requirements) {
      if (
        requirement.excludedProviders.includes(
          candidate.key,
        )
      ) {
        penalties += 40;
        reasons.push(
          `Provider is excluded for capability ${requirement.capability}.`,
        );
      }

      if (
        requirement.required &&
        !candidate.capabilities.includes(
          requirement.capability,
        )
      ) {
        penalties +=
          Math.max(
            5,
            requirement.priority * 2,
          );

        reasons.push(
          `Required capability is missing: ${requirement.capability}.`,
        );
      }

      if (
        requirement.preferredProviders.includes(
          candidate.key,
        )
      ) {
        reasons.push(
          `Preferred provider for capability ${requirement.capability}.`,
        );
      }
    }

    const weighted =
      candidate.qualityScore * 0.2 +
      candidate.securityScore * 0.25 +
      candidate.compatibilityScore * 0.25 +
      candidate.maintenanceScore * 0.15 +
      candidate.costScore * 0.05 +
      capabilityCoverage * 0.1;

    const total =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(weighted - penalties),
        ),
      );

    return {
      blueprintKey: candidate.key,
      version: candidate.version,
      total,
      quality: candidate.qualityScore,
      security: candidate.securityScore,
      compatibility:
        candidate.compatibilityScore,
      maintenance:
        candidate.maintenanceScore,
      cost: candidate.costScore,
      capabilityCoverage,
      penalties,
      reasons,
    };
  }
}
