import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationIntelligenceService {
  plan(input: {
    urgency: number;
    relevance: number;
    userEngagement: number;
  }) {
    const priorityScore = Math.round(
      input.urgency * 0.4 +
        input.relevance * 0.35 +
        input.userEngagement * 0.25,
    );

    return {
      priorityScore,
      channel:
        priorityScore >= 80
          ? "PUSH_AND_SMS"
          : priorityScore >= 55
            ? "PUSH"
            : "IN_APP",
    };
  }
}
