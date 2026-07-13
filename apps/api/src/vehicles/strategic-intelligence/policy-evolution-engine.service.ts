import { Injectable } from "@nestjs/common";

@Injectable()
export class PolicyEvolutionEngineService {
  evolve(input: {
    effectivenessScore: number;
    adoptionScore: number;
    incidentScore: number;
    regulatoryChangeScore: number;
  }) {
    const evolutionScore = Math.round(
      input.effectivenessScore * 0.3 +
        input.adoptionScore * 0.2 +
        input.regulatoryChangeScore * 0.3 -
        input.incidentScore * 0.2,
    );

    return {
      evolutionScore,
      action:
        evolutionScore >= 75
          ? "PUBLISH_UPDATE"
          : evolutionScore >= 50
            ? "REVIEW"
            : "HOLD",
    };
  }
}
