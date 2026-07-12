export interface BlueprintCandidate {
  key: string;
  version: string;
  capabilities: string[];
  compatibilityScore: number;
  qualityScore: number;
  securityScore: number;
  adoptionScore: number;
}

export interface RankedBlueprint {
  key: string;
  version: string;
  score: number;
  rank: number;
  matchedCapabilities: string[];
}

export class AdaptiveBlueprintIntelligence {
  rank(
    requiredCapabilities: readonly string[],
    candidates: readonly BlueprintCandidate[],
  ): RankedBlueprint[] {
    return candidates
      .map((candidate) => {
        const matchedCapabilities = requiredCapabilities.filter((capability) =>
          candidate.capabilities.includes(capability),
        );

        const capabilityCoverage =
          requiredCapabilities.length === 0
            ? 100
            : (matchedCapabilities.length / requiredCapabilities.length) * 100;

        const score = Math.round(
          capabilityCoverage * 0.35 +
            candidate.compatibilityScore * 0.25 +
            candidate.qualityScore * 0.2 +
            candidate.securityScore * 0.15 +
            candidate.adoptionScore * 0.05,
        );

        return {
          key: candidate.key,
          version: candidate.version,
          score,
          rank: 0,
          matchedCapabilities,
        };
      })
      .sort((left, right) => right.score - left.score)
      .map((candidate, index) => ({ ...candidate, rank: index + 1 }));
  }
}
