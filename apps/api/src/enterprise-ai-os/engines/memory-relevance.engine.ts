import { Injectable } from "@nestjs/common";
@Injectable()
export class MemoryRelevanceEngine {
  rank(items: Array<{ id: string; importance: number; ageDays: number }>) {
    return items
      .map((item) => ({
        ...item,
        relevance: Math.max(0, item.importance - item.ageDays * 0.5),
      }))
      .sort((a, b) => b.relevance - a.relevance);
  }
}
