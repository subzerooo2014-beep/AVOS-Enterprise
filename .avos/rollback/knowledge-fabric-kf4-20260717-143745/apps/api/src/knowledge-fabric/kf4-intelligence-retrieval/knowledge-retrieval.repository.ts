import { Injectable } from "@nestjs/common";
import { KnowledgeSearchResult } from "./knowledge-retrieval.types";

@Injectable()
export class KnowledgeRetrievalRepository {
  private readonly results = new Map<string, KnowledgeSearchResult>();

  replace(items: KnowledgeSearchResult[]): void {
    this.results.clear();
    for (const item of items) this.results.set(`${item.kind}:${item.id}`, item);
  }

  list(): KnowledgeSearchResult[] {
    return [...this.results.values()];
  }

  countByKind(kind: KnowledgeSearchResult["kind"]): number {
    return this.list().filter((item) => item.kind === kind).length;
  }
}