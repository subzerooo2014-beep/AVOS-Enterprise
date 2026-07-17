import { Injectable } from "@nestjs/common";
import { KnowledgeSearchResult } from "./knowledge-retrieval.types";

@Injectable()
export class KnowledgeRankingService {
  score(query: string, title: string, summary: string): number {
    const tokens = this.tokens(query);
    if (tokens.length === 0) return 0;
    const titleText = title.toLowerCase();
    const summaryText = summary.toLowerCase();
    let score = 0;
    for (const token of tokens) {
      if (titleText.includes(token)) score += 0.55;
      if (summaryText.includes(token)) score += 0.3;
    }
    if (`${titleText} ${summaryText}`.includes(query.trim().toLowerCase())) score += 0.15;
    return Math.min(1, Number(score.toFixed(4)));
  }

  rank(items: KnowledgeSearchResult[], limit: number, minScore: number): KnowledgeSearchResult[] {
    return items
      .filter((item) => item.score >= minScore)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, limit);
  }

  private tokens(value: string): string[] {
    return [...new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 2))];
  }
}