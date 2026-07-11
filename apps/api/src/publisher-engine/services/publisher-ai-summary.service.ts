import { Injectable } from "@nestjs/common";
import { PublisherAiScoreService } from "./publisher-ai-score.service";
import { PublisherAiRoutingService } from "./publisher-ai-routing.service";

@Injectable()
export class PublisherAiSummaryService {
  constructor(
    private readonly score: PublisherAiScoreService,
    private readonly routing: PublisherAiRoutingService,
  ) {}

  analyze(job: any) {
    return {
      success: true,
      score: this.score.score(job),
      routing: this.routing.route(job),
      analyzedAt: new Date(),
    };
  }
}
