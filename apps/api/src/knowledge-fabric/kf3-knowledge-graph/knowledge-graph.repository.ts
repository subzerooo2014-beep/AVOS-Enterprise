import { Injectable } from "@nestjs/common";
import {
  KnowledgeNode,
  KnowledgeRelation,
} from "./knowledge-graph.types";

@Injectable()
export class KnowledgeGraphRepository {
  private readonly nodes = new Map<string, KnowledgeNode>();
  private readonly nodeKeyIndex = new Map<string, string>();
  private readonly relations = new Map<string, KnowledgeRelation>();

  saveNode(node: KnowledgeNode): KnowledgeNode {
    const existingId = this.nodeKeyIndex.get(node.key);
    if (existingId && existingId !== node.id) {
      const existing = this.nodes.get(existingId);
      if (existing) return existing;
    }
    this.nodes.set(node.id, node);
    this.nodeKeyIndex.set(node.key, node.id);
    return node;
  }

  saveRelation(relation: KnowledgeRelation): KnowledgeRelation {
    this.relations.set(relation.id, relation);
    return relation;
  }

  findNode(idOrKey: string): KnowledgeNode | undefined {
    const direct = this.nodes.get(idOrKey);
    if (direct) return direct;
    const id = this.nodeKeyIndex.get(idOrKey);
    return id ? this.nodes.get(id) : undefined;
  }

  findRelation(id: string): KnowledgeRelation | undefined {
    return this.relations.get(id);
  }

  listNodes(): KnowledgeNode[] {
    return Array.from(this.nodes.values());
  }

  listRelations(): KnowledgeRelation[] {
    return Array.from(this.relations.values());
  }

  hasRelation(fromNodeId: string, toNodeId: string, type: string): boolean {
    return this.listRelations().some(
      (relation) =>
        relation.fromNodeId === fromNodeId &&
        relation.toNodeId === toNodeId &&
        relation.type === type,
    );
  }

  countNodes(): number { return this.nodes.size; }
  countRelations(): number { return this.relations.size; }
}