import { Injectable } from "@nestjs/common";

@Injectable()
export class AutonomousCampaignIntelligenceService {
  plan(input: {
    audienceFit: number;
    creativeScore: number;
    timingScore: number;
    budgetEfficiency: number;
  }) {
    const campaignScore = Math.round(
      input.audienceFit * 0.35 +
        input.creativeScore * 0.25 +
        input.timingScore * 0.2 +
        input.budgetEfficiency * 0.2,
    );

    return {
      campaignScore,
      action:
        campaignScore >= 80
          ? "LAUNCH"
          : campaignScore >= 60
            ? "TEST"
            : "REBUILD",
    };
  }
}
