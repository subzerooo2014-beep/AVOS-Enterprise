import { Injectable } from "@nestjs/common";
import { KnowledgeIntelligenceItem, KnowledgeSemanticMatch } from "./knowledge-intelligence.types";

@Injectable()
export class KnowledgeSemanticSearchService {
  search(query: string, items: KnowledgeIntelligenceItem[], limit = 10): KnowledgeSemanticMatch[] {
    const terms = this.tokens(query);
    return items
      .map((item) => this.score(item, terms))
      .filter((match) => match.finalScore > 0)
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, Math.max(1, Math.min(limit, 100)));
  }

  private score(item: KnowledgeIntelligenceItem, terms: string[]): KnowledgeSemanticMatch {
    const content = `${item.key} ${item.name} ${item.namespace} ${item.tags.join(" ")} ${this.stringify(item.content)}`.toLowerCase();
    const lexicalHits = terms.filter((term) => content.includes(term)).length;
    const lexicalScore = terms.length === 0 ? 0 : lexicalHits / terms.length;
    const tagHits = terms.filter((term) => item.tags.some((tag) => tag.toLowerCase().includes(term))).length;
    const tagScore = terms.length === 0 ? 0 : tagHits / terms.length;
    const semanticScore = this.cosineLike(terms, this.tokens(content));
    const finalScore = Number((semanticScore * 0.45 + lexicalScore * 0.35 + tagScore * 0.2).toFixed(4));
    const reasons: string[] = [];
    if (semanticScore > 0) reasons.push("semantic-overlap");
    if (lexicalScore > 0) reasons.push("lexical-match");
    if (tagScore > 0) reasons.push("tag-match");
    return { item, semanticScore, lexicalScore, tagScore, finalScore, reasons };
  }

  private tokens(value: string): string[] {
    return Array.from(new Set(value.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g, " ").split(" ").filter((x) => x.length > 1)));
  }

  private cosineLike(left: string[], right: string[]): number {
    if (!left.length || !right.length) return 0;
    const rightSet = new Set(right);
    const overlap = left.filter((token) => rightSet.has(token)).length;
    return Number((overlap / Math.sqrt(left.length * rightSet.size)).toFixed(4));
  }

  private stringify(value: unknown): string {
    try { return typeof value === "string" ? value : JSON.stringify(value); } catch { return ""; }
  }
}