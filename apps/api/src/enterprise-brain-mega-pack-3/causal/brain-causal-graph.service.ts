import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  BrainCausalEdge,
  BrainCausalNode
} from "../enterprise-brain-mega-pack-3.types";
import { BrainReasoningAuditService } from "../observability/brain-reasoning-audit.service";

@Injectable()
export class BrainCausalGraphService {
  private readonly nodes = new Map<string, BrainCausalNode>();
  private readonly edges = new Map<string, BrainCausalEdge>();

  constructor(
    private readonly audit: BrainReasoningAuditService
  ) {}

  listNodes() {
    return Array.from(this.nodes.values());
  }

  listEdges() {
    return Array.from(this.edges.values());
  }

  getNode(id: string) {
    const node = this.nodes.get(id);

    if (!node) {
      throw new NotFoundException(`Brain causal node not found: ${id}`);
    }

    return node;
  }

  createNode(
    input: Omit<BrainCausalNode, "createdAt" | "updatedAt">
  ) {
    if (this.nodes.has(input.id)) {
      throw new ConflictException(`Brain causal node already exists: ${input.id}`);
    }

    const now = new Date().toISOString();
    const node: BrainCausalNode = {
      ...input,
      createdAt: now,
      updatedAt: now
    };

    this.nodes.set(node.id, node);
    return node;
  }

  createEdge(
    input: Omit<BrainCausalEdge, "createdAt" | "updatedAt">
  ) {
    this.getNode(input.fromNodeId);
    this.getNode(input.toNodeId);

    if (this.edges.has(input.id)) {
      throw new ConflictException(`Brain causal edge already exists: ${input.id}`);
    }

    const now = new Date().toISOString();

    const edge: BrainCausalEdge = {
      ...input,
      strength: Math.max(0, Math.min(100, input.strength)),
      confidence: Math.max(0, Math.min(100, input.confidence)),
      createdAt: now,
      updatedAt: now
    };

    this.edges.set(edge.id, edge);
    return edge;
  }

  effectsOf(nodeId: string, depth = 3) {
    this.getNode(nodeId);

    const visited = new Set<string>();
    const paths: Array<{
      from: string;
      to: string;
      edgeId: string;
      depth: number;
    }> = [];

    const walk = (current: string, level: number) => {
      if (level > depth || visited.has(`${current}:${level}`)) return;
      visited.add(`${current}:${level}`);

      for (const edge of this.listEdges().filter(
        (item) =>
          item.active &&
          item.fromNodeId === current
      )) {
        paths.push({
          from: edge.fromNodeId,
          to: edge.toNodeId,
          edgeId: edge.id,
          depth: level
        });

        walk(edge.toNodeId, level + 1);
      }
    };

    walk(nodeId, 1);

    return {
      source: this.getNode(nodeId),
      paths,
      effects: Array.from(
        new Set(paths.map((path) => path.to))
      ).map((id) => this.getNode(id))
    };
  }

  summary() {
    return {
      nodes: this.nodes.size,
      edges: this.edges.size,
      activeEdges: this.listEdges().filter((x) => x.active).length
    };
  }
}
