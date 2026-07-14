import { Injectable } from "@nestjs/common";
@Injectable()
export class KnowledgeRetrievalEngine {
  rank(query: string, nodes: Array<{ id: string; label: string; type: string }>) {
    const normalized = query.toLowerCase();
    return nodes
      .map((node) => ({
        ...node,
        score: node.label.toLowerCase().includes(normalized) ? 100 : 50,
      }))
      .sort((a, b) => b.score - a.score);
  }
}
