import { Injectable } from "@nestjs/common";
import { KnowledgeSemanticMatch } from "./knowledge-intelligence.types";

@Injectable()
export class KnowledgeRankingService {
  rank(matches: KnowledgeSemanticMatch[]): KnowledgeSemanticMatch[] {
    return matches.map((match) => {
      const freshness = 1 / Math.max(1, match.item.version);
      const quality = (match.item.trustScore + match.item.confidenceScore) / 2;
      const finalScore = Number(Math.min(1, match.finalScore * 0.7 + quality * 0.25 + freshness * 0.05).toFixed(4));
      return { ...match, finalScore, reasons: [...match.reasons, "quality-ranking"] };
    }).sort((a, b) => b.finalScore - a.finalScore);
  }
}