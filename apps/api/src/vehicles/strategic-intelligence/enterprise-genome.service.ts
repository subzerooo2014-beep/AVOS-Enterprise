import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseGenomeService {
  analyze(input: {
    cultureScore: number;
    processScore: number;
    intelligenceScore: number;
    ecosystemScore: number;
  }) {
    const genomeScore = Math.round(
      input.cultureScore * 0.2 +
        input.processScore * 0.25 +
        input.intelligenceScore * 0.3 +
        input.ecosystemScore * 0.25,
    );

    return {
      genomeScore,
      state:
        genomeScore >= 85
          ? "EVOLVED"
          : genomeScore >= 65
            ? "ADAPTIVE"
            : "FOUNDATIONAL",
    };
  }
}
