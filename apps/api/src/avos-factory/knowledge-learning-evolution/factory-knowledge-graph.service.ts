import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FactoryGraphEdge,
  FactoryGraphNode,
} from "./factory-knowledge.contracts";

@Injectable()
export class FactoryKnowledgeGraphService {
  private readonly nodes = new Map<string, FactoryGraphNode>();
  private readonly edges = new Map<string, FactoryGraphEdge>();

  addNode(node: FactoryGraphNode): FactoryGraphNode {
    this.nodes.set(node.id, node);
    return structuredClone(node);
  }

  connect(input: Omit<FactoryGraphEdge, "id">): FactoryGraphEdge {
    if (!this.nodes.has(input.source) || !this.nodes.has(input.target)) {
      throw new Error("Both graph nodes must exist before creating an edge.");
    }

    const edge: FactoryGraphEdge = {
      id: randomUUID(),
      ...input,
    };

    this.edges.set(edge.id, edge);
    return structuredClone(edge);
  }

  snapshot() {
    return {
      nodes: structuredClone([...this.nodes.values()]),
      edges: structuredClone([...this.edges.values()]),
    };
  }

  nodeCount(): number {
    return this.nodes.size;
  }

  edgeCount(): number {
    return this.edges.size;
  }
}
