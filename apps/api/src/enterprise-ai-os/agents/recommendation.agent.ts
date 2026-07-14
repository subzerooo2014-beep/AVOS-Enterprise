import { Injectable } from "@nestjs/common";
@Injectable()
export class RecommendationAgent {
  execute(candidates: Array<Record<string, unknown>>) {
    return candidates.map((candidate, index) => ({
      ...candidate,
      rank: index + 1,
      score: Math.max(0, 100 - index * 5),
    }));
  }
}
