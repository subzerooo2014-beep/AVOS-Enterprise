import { Injectable } from "@nestjs/common";
@Injectable()
export class ReviewIntelligenceEngine {
  summarize(scores: number[]) {
    const average = scores.length ? scores.reduce((a,b) => a+b,0) / scores.length : 0;
    return {
      average: Math.round(average * 100) / 100,
      sentiment: average >= 4 ? "POSITIVE" : average >= 3 ? "NEUTRAL" : "NEGATIVE",
      count: scores.length,
    };
  }
}
