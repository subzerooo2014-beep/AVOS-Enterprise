import { Injectable } from "@nestjs/common";

@Injectable()
export class CapabilityFusionEngineService {
  fuse(input: {
    intelligenceScore: number;
    automationScore: number;
    integrationScore: number;
    governanceScore: number;
  }) {
    const fusionScore = Math.round(
      input.intelligenceScore * 0.3 +
        input.automationScore * 0.25 +
        input.integrationScore * 0.25 +
        input.governanceScore * 0.2,
    );

    return {
      fusionScore,
      state: fusionScore >= 85 ? "OPTIMIZED" : fusionScore >= 65 ? "READY" : "DEVELOPING",
    };
  }
}
