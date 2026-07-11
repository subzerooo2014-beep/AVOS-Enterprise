import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherChannelRankingService {
  rank(stats: Record<string, any>) {
    return Object.entries(stats)
      .map(([channel,data]: any)=>({
        channel,
        score: (data.published ?? 0) - (data.failed ?? 0),
      }))
      .sort((a,b)=>b.score-a.score);
  }
}
