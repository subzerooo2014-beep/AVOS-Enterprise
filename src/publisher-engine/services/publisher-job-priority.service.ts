import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobPriorityService {
  calculate(job: any) {
    let score = 0;

    switch (String(job?.priority ?? "normal")) {
      case "urgent":
        score += 100;
        break;
      case "high":
        score += 75;
        break;
      case "normal":
        score += 50;
        break;
      default:
        score += 25;
    }

    if (job?.campaignId) score += 10;
    if (job?.channelId) score += 5;

    return score;
  }
}
