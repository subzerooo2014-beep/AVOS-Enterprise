import { Injectable } from "@nestjs/common";
import { KnowledgeIntelligenceItem } from "./knowledge-intelligence.types";

@Injectable()
export class KnowledgeSimilarityService {
  similarity(left: KnowledgeIntelligenceItem, right: KnowledgeIntelligenceItem): number {
    const leftTokens = this.tokens(left);
    const rightTokens = this.tokens(right);
    if (!leftTokens.size || !rightTokens.size) return 0;
    const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
    const union = new Set([...leftTokens, ...rightTokens]).size;
    return Number((intersection / union).toFixed(4));
  }

  findSimilar(source: KnowledgeIntelligenceItem, items: KnowledgeIntelligenceItem[], limit = 5) {
    return items.filter((item) => item.knowledgeId !== source.knowledgeId)
      .map((item) => ({ item, score: this.similarity(source, item) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(1, limit));
  }

  private tokens(item: KnowledgeIntelligenceItem): Set<string> {
    const raw = `${item.key} ${item.name} ${item.namespace} ${item.tags.join(" ")} ${JSON.stringify(item.content)}`;
    return new Set(raw.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g, " ").split(" ").filter((x) => x.length > 1));
  }
}