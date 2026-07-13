import { Injectable } from "@nestjs/common";

@Injectable()
export class LeadIntelligenceService {
  score(input: {
    engagement: number;
    budgetFit: number;
    urgency: number;
  }) {
    const score = Math.round(
      input.engagement * 0.4 +
        input.budgetFit * 0.35 +
        input.urgency * 0.25,
    );

    return {
      score,
      stage:
        score >= 80
          ? "HOT"
          : score >= 55
            ? "WARM"
            : "COLD",
    };
  }
}
