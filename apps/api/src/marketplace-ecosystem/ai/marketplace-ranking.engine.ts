import { Injectable } from "@nestjs/common";
@Injectable()
export class MarketplaceRankingEngine {
  rank(items: Array<{ id: string; trustScore: number; rating: number; price: number; relevance: number }>) {
    return items
      .map((item) => ({
        ...item,
        score: Math.round(
          item.trustScore * 0.35 +
          item.rating * 10 * 0.25 +
          item.relevance * 0.3 +
          Math.max(0, 100 - item.price / 1000) * 0.1,
        ),
      }))
      .sort((a,b) => b.score - a.score);
  }
}
