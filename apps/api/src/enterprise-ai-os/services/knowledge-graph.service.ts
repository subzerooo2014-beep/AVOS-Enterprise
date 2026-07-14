import { Injectable, NotFoundException } from "@nestjs/common";
import { KnowledgePolicy } from "../policies/knowledge.policy";
import { KnowledgeNode } from "../enterprise-ai-os.types";
import { aiOsId } from "../enterprise-ai-os.utils";
@Injectable()
export class KnowledgeGraphService {
  private readonly nodes = new Map<string, KnowledgeNode>();
  private readonly edges: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: KnowledgePolicy) {}
  createNode(input: {
    type: string;
    label: string;
    properties: Record<string, unknown>;
  }) {
    this.policy.validate(input.type, input.label);
    const record: KnowledgeNode = {
      id: aiOsId("node"),
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.nodes.set(record.id, record);
    return record;
  }
  createEdge(input: {
    fromNodeId: string;
    toNodeId: string;
    relation: string;
    weight?: number;
  }) {
    if (!this.nodes.has(input.fromNodeId)) {
      throw new NotFoundException("Source node not found");
    }
    if (!this.nodes.has(input.toNodeId)) {
      throw new NotFoundException("Target node not found");
    }
    const edge = {
      id: aiOsId("edge"),
      ...input,
      weight: input.weight ?? 1,
      createdAt: new Date().toISOString(),
    };
    this.edges.push(edge);
    return edge;
  }
  listNodes() { return [...this.nodes.values()]; }
  listEdges() { return [...this.edges]; }
}
