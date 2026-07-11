import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherAiScoreService {
  score(job: any) {
    let score = 50;

    if (job?.priority === "urgent") score += 30;
    if (job?.priority === "high") score += 20;
    if (job?.campaignId) score += 10;
    if (job?.channelId) score += 5;

    return {
      success: true,
      score: Math.min(score,100),
    };
  }
}
