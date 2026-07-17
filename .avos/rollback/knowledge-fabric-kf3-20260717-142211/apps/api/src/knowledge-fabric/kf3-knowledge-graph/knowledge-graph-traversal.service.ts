import { Injectable } from "@nestjs/common";
import { KnowledgeGraphRepository } from "./knowledge-graph.repository";
import { KnowledgeTraversalResult } from "./knowledge-graph.types";

@Injectable()
export class KnowledgeGraphTraversalService {
  constructor(private readonly repository: KnowledgeGraphRepository) {}

  traverse(startNodeId: string, maxDepth = 2): KnowledgeTraversalResult {
    const start = this.repository.findNode(startNodeId);
    if (!start) throw new Error(`Knowledge node not found: ${startNodeId}`);

    const depthLimit = Math.max(0, Math.min(maxDepth, 10));
    const visited = new Set<string>([start.id]);
    const selectedRelationIds = new Set<string>();
    let frontier = [start.id];

    for (let depth = 0; depth < depthLimit; depth += 1) {
      const next: string[] = [];
      for (const nodeId of frontier) {
        for (const relation of this.repository.listRelations()) {
          let adjacent: string | undefined;
          if (relation.fromNodeId === nodeId) adjacent = relation.toNodeId;
          else if (relation.toNodeId === nodeId) adjacent = relation.fromNodeId;
          if (!adjacent) continue;
          selectedRelationIds.add(relation.id);
          if (!visited.has(adjacent)) {
            visited.add(adjacent);
            next.push(adjacent);
          }
        }
      }
      frontier = next;
      if (frontier.length === 0) break;
    }

    return {
      startNodeId: start.id,
      depth: depthLimit,
      nodes: Array.from(visited)
        .map((id) => this.repository.findNode(id))
        .filter((node): node is NonNullable<typeof node> => Boolean(node)),
      relations: Array.from(selectedRelationIds)
        .map((id) => this.repository.findRelation(id))
        .filter((relation): relation is NonNullable<typeof relation> => Boolean(relation)),
    };
  }
}