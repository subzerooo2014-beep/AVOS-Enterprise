import { Injectable } from "@nestjs/common";
import {
  KnowledgeEvidence,
  KnowledgeFabricQuery,
  KnowledgeSearchResult,
} from "../contracts/knowledge-fabric-production.contracts";
import { UnifiedKnowledgeRegistryService } from "../registry/unified-knowledge-registry.service";

@Injectable()
export class UnifiedSearchPipelineService {
  constructor(
    private readonly registry: UnifiedKnowledgeRegistryService,
  ) {}

  async execute(input: KnowledgeFabricQuery): Promise<KnowledgeSearchResult> {
    const started = Date.now();
    const normalizedQuery = this.normalize(input.query);
    const intent = this.detectIntent(normalizedQuery);
    const limit = Math.min(Math.max(input.limit ?? 10, 1), 100);

    const evidence = this.registry
      .list()
      .filter((entry) => entry.enabled && entry.health !== "unavailable")
      .map<KnowledgeEvidence>((entry) => {
        const haystack = `${entry.name} ${entry.type} ${JSON.stringify(entry.metadata ?? {})}`.toLowerCase();
        const terms = normalizedQuery.split(" ").filter(Boolean);
        const matches = terms.filter((term) => haystack.includes(term)).length;
        const relevance = terms.length === 0 ? 0 : matches / terms.length;
        const healthWeight = entry.health === "healthy" ? 1 : 0.6;

        return {
          sourceId: entry.id,
          sourceType: entry.type,
          title: entry.name,
          excerpt: `Registered ${entry.type} capability ${entry.name}.`,
          score: Number((relevance * healthWeight).toFixed(4)),
          trustScore: entry.health === "healthy" ? 1 : 0.7,
          metadata: entry.metadata,
        };
      })
      .filter((item) => item.score > 0 || normalizedQuery.length === 0)
      .sort(
        (left, right) =>
          right.score * right.trustScore - left.score * left.trustScore,
      )
      .slice(0, limit);

    return {
      correlationId:
        input.correlationId ??
        `kf-search:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      query: input.query,
      normalizedQuery,
      intent,
      evidence,
      total: evidence.length,
      durationMs: Date.now() - started,
      generatedAt: new Date().toISOString(),
    };
  }

  private normalize(query: string): string {
    return query
      .normalize("NFKC")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  private detectIntent(query: string): string {
    if (/\b(why|سبب|لماذا)\b/u.test(query)) return "explanation";
    if (/\b(how|كيف)\b/u.test(query)) return "procedure";
    if (/\b(find|search|ابحث|بحث)\b/u.test(query)) return "search";
    if (/\b(status|health|حالة|صحة)\b/u.test(query)) return "health";
    return "knowledge-query";
  }
}