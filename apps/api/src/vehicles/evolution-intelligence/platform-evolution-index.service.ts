import { Injectable } from "@nestjs/common";

@Injectable()
export class PlatformEvolutionIndexService {
  calculate(input: {
    innovationScore: number;
    adoptionScore: number;
    stabilityScore: number;
    automationScore: number;
  }) {
    const evolutionIndex = Math.round(
      input.innovationScore * 0.3 +
        input.adoptionScore * 0.25 +
        input.stabilityScore * 0.2 +
        input.automationScore * 0.25,
    );

    return {
      evolutionIndex,
      level: evolutionIndex >= 85 ? "LEADING" : evolutionIndex >= 65 ? "ADVANCING" : "EMERGING",
    };
  }
}
