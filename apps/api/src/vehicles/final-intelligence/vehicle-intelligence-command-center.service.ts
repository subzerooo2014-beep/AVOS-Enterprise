import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleIntelligenceCommandCenterService {
  evaluate(input: {
    operationalScore: number;
    intelligenceScore: number;
    governanceScore: number;
    marketScore: number;
  }) {
    const commandScore = Math.round(
      input.operationalScore * 0.25 +
        input.intelligenceScore * 0.3 +
        input.governanceScore * 0.2 +
        input.marketScore * 0.25,
    );

    return {
      commandScore,
      mode:
        commandScore >= 85
          ? "AUTONOMOUS"
          : commandScore >= 65
            ? "ASSISTED"
            : "CONTROLLED",
    };
  }
}
