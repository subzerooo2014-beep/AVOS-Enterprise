import { Injectable } from "@nestjs/common";

@Injectable()
export class InnovationPortfolioEngineService {
  evaluate(input: {
    noveltyScore: number;
    feasibilityScore: number;
    valueScore: number;
    timingScore: number;
  }) {
    const innovationScore = Math.round(
      input.noveltyScore * 0.3 +
        input.feasibilityScore * 0.25 +
        input.valueScore * 0.3 +
        input.timingScore * 0.15,
    );

    return {
      innovationScore,
      action:
        innovationScore >= 80
          ? "ACCELERATE"
          : innovationScore >= 60
            ? "INCUBATE"
            : "ARCHIVE",
    };
  }
}
