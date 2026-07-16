import { Injectable } from "@nestjs/common";
import { KnowledgeCatalogService } from "./knowledge-catalog.service";
import { VectorMemoryService } from "./vector-memory.service";

@Injectable()
export class SemanticSearchService {
  private searchCountValue = 0;

  constructor(
    private readonly catalog: KnowledgeCatalogService,
    private readonly vectorMemory: VectorMemoryService,
  ) {}

  search(query: string, namespace = "knowledge", limit = 10) {
    this.searchCountValue += 1;
    const normalized = query.toLowerCase();
    const lexical = this.catalog
      .list()
      .filter(
        (document) =>
          document.title.toLowerCase().includes(normalized) ||
          document.content.toLowerCase().includes(normalized) ||
          document.tags.some((tag) => tag.toLowerCase().includes(normalized)),
      )
      .map((document) => ({
        id: document.id,
        score: 1,
        title: document.title,
        content: document.content,
        source: "CATALOG",
      }));

    const semantic = this.vectorMemory.search(namespace, query, limit).map((result) => ({
      id: result.id,
      score: result.score,
      title: String(result.metadata["title"] ?? result.id),
      content: result.text,
      source: "VECTOR",
    }));

    return [...lexical, ...semantic]
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(1, limit));
  }

  searchCount(): number { return this.searchCountValue; }
}
