import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseOperatingModelService {
  evaluate(input: {
    alignmentScore: number;
    executionScore: number;
    governanceScore: number;
    adaptabilityScore: number;
  }) {
    const operatingScore = Math.round(
      input.alignmentScore * 0.25 +
        input.executionScore * 0.3 +
        input.governanceScore * 0.2 +
        input.adaptabilityScore * 0.25,
    );

    return {
      operatingScore,
      mode:
        operatingScore >= 85
          ? "AUTONOMOUS"
          : operatingScore >= 65
            ? "ADAPTIVE"
            : "CONTROLLED",
    };
  }
}
