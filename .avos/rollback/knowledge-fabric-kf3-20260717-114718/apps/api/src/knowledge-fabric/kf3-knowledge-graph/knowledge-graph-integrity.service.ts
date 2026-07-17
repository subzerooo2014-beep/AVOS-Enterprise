import { Injectable } from "@nestjs/common";
import { KnowledgeGraphRepository } from "./knowledge-graph.repository";

@Injectable()
export class KnowledgeGraphIntegrityService {
  constructor(private readonly repository: KnowledgeGraphRepository) {}

  orphanNodeIds(): string[] {
    const connected = new Set<string>();
    for (const relation of this.repository.listRelations()) {
      connected.add(relation.fromNodeId);
      connected.add(relation.toNodeId);
    }
    return this.repository
      .listNodes()
      .filter((node) => !connected.has(node.id))
      .map((node) => node.id);
  }

  validate() {
    const brokenRelations = this.repository.listRelations().filter(
      (relation) =>
        !this.repository.findNode(relation.fromNodeId) ||
        !this.repository.findNode(relation.toNodeId),
    );

    return {
      valid: brokenRelations.length === 0,
      brokenRelationIds: brokenRelations.map((relation) => relation.id),
      orphanNodeIds: this.orphanNodeIds(),
      checkedAt: new Date().toISOString(),
    };
  }
}