import { Injectable } from "@nestjs/common";
import type { KnowledgeEdge, KnowledgeNode } from "./enterprise-knowledge-intelligence.types";

@Injectable()
export class KnowledgeGraphService {
  private readonly nodes = new Map<string, KnowledgeNode>();
  private readonly edges = new Map<string, KnowledgeEdge>();

  upsertNode(input: Omit<KnowledgeNode, "version" | "createdAt" | "updatedAt">): KnowledgeNode {
    const existing = this.nodes.get(input.id);
    const now = new Date().toISOString();
    const node: KnowledgeNode = {
      ...input,
      metadata: { ...input.metadata },
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    this.nodes.set(node.id, node);
    return this.cloneNode(node);
  }

  connect(input: Omit<KnowledgeEdge, "id" | "createdAt"> & { id?: string }): KnowledgeEdge {
    const edge: KnowledgeEdge = {
      ...input,
      id: input.id ?? `edge-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
    };
    this.edges.set(edge.id, edge);
    return { ...edge };
  }

  neighbors(nodeId: string): KnowledgeNode[] {
    const ids = new Set(
      Array.from(this.edges.values())
        .filter((edge) => edge.source === nodeId || edge.target === nodeId)
        .map((edge) => (edge.source === nodeId ? edge.target : edge.source)),
    );
    return Array.from(ids)
      .map((id) => this.nodes.get(id))
      .filter((node): node is KnowledgeNode => Boolean(node))
      .map((node) => this.cloneNode(node));
  }

  listNodes(): KnowledgeNode[] {
    return Array.from(this.nodes.values()).map((node) => this.cloneNode(node));
  }

  listEdges(): KnowledgeEdge[] {
    return Array.from(this.edges.values()).map((edge) => ({ ...edge }));
  }

  nodeCount(): number { return this.nodes.size; }
  edgeCount(): number { return this.edges.size; }

  private cloneNode(node: KnowledgeNode): KnowledgeNode {
    return { ...node, metadata: { ...node.metadata } };
  }
}
