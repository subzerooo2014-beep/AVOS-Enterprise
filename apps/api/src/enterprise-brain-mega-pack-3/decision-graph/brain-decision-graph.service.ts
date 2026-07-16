import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  BrainDecisionGraphEdge,
  BrainDecisionGraphNode
} from "../enterprise-brain-mega-pack-3.types";

@Injectable()
export class BrainDecisionGraphService {
  private readonly nodes = new Map<string, BrainDecisionGraphNode>();
  private readonly edges = new Map<string, BrainDecisionGraphEdge>();

  listNodes() {
    return Array.from(this.nodes.values());
  }

  listEdges() {
    return Array.from(this.edges.values());
  }

  getNode(id: string) {
    const node = this.nodes.get(id);

    if (!node) {
      throw new NotFoundException(`Brain decision graph node not found: ${id}`);
    }

    return node;
  }

  createNode(
    input: Omit<BrainDecisionGraphNode, "createdAt" | "updatedAt">
  ) {
    if (this.nodes.has(input.id)) {
      throw new ConflictException(`Brain decision graph node exists: ${input.id}`);
    }

    const now = new Date().toISOString();

    const node: BrainDecisionGraphNode = {
      ...input,
      score: Math.max(0, Math.min(100, input.score)),
      confidence: Math.max(0, Math.min(100, input.confidence)),
      createdAt: now,
      updatedAt: now
    };

    this.nodes.set(node.id, node);
    return node;
  }

  createEdge(
    input: Omit<BrainDecisionGraphEdge, "createdAt" | "updatedAt">
  ) {
    this.getNode(input.fromNodeId);
    this.getNode(input.toNodeId);

    const now = new Date().toISOString();

    const edge: BrainDecisionGraphEdge = {
      ...input,
      weight: Math.max(0, Math.min(100, input.weight)),
      confidence: Math.max(0, Math.min(100, input.confidence)),
      createdAt: now,
      updatedAt: now
    };

    this.edges.set(edge.id, edge);
    return edge;
  }

  evaluate() {
    const optionNodes = this.listNodes()
      .filter((node) => node.kind === "option");

    const ranked = optionNodes.map((option) => {
      const incoming = this.listEdges().filter(
        (edge) => edge.toNodeId === option.id
      );

      const support = incoming
        .filter((edge) => edge.relation === "supports")
        .reduce(
          (sum, edge) =>
            sum +
            edge.weight *
            edge.confidence /
            100,
          0
        );

      const opposition = incoming
        .filter((edge) => edge.relation === "opposes")
        .reduce(
          (sum, edge) =>
            sum +
            edge.weight *
            edge.confidence /
            100,
          0
        );

      const finalScore = Number(
        (
          option.score * 0.5 +
          option.confidence * 0.2 +
          support * 0.3 -
          opposition * 0.3
        ).toFixed(2)
      );

      return {
        option,
        finalScore,
        support,
        opposition
      };
    })
    .sort((left, right) => right.finalScore - left.finalScore);

    return {
      selected: ranked[0],
      ranked
    };
  }

  summary() {
    return {
      nodes: this.nodes.size,
      edges: this.edges.size,
      options: this.listNodes().filter((x) => x.kind === "option").length
    };
  }
}
