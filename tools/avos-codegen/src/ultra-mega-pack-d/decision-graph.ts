import { randomUUID } from "node:crypto";
import { UltraDEvidence, UltraDValue } from "./contracts";

export interface DecisionGraphNode {
  id: string;
  key: string;
  kind: "fact" | "option" | "decision" | "outcome" | "control";
  label: string;
  weight: number;
  metadata: Record<string, UltraDValue>;
}

export interface DecisionGraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  confidence: number;
}

export interface DecisionTrace {
  decisionKey: string;
  path: string[];
  aggregateConfidence: number;
  evidence: UltraDEvidence[];
  tracedAt: string;
}

export class EnterpriseDecisionGraph {
  private readonly nodes = new Map<string, DecisionGraphNode>();
  private readonly edges: DecisionGraphEdge[] = [];

  addNode(node: Omit<DecisionGraphNode, "id"> & { id?: string }): DecisionGraphNode {
    const stored: DecisionGraphNode = {
      ...structuredClone(node),
      id: node.id ?? randomUUID(),
    };
    this.nodes.set(stored.key, stored);
    return structuredClone(stored);
  }

  connect(edge: Omit<DecisionGraphEdge, "id"> & { id?: string }): DecisionGraphEdge {
    if (!this.nodes.has(edge.source) || !this.nodes.has(edge.target)) {
      throw new Error("Decision graph edge references an unknown node.");
    }

    const stored: DecisionGraphEdge = {
      ...structuredClone(edge),
      id: edge.id ?? randomUUID(),
      confidence: Math.max(0, Math.min(100, edge.confidence)),
    };
    this.edges.push(stored);
    return structuredClone(stored);
  }

  trace(systemKey: string, decisionKey: string): DecisionTrace {
    if (!this.nodes.has(decisionKey)) {
      throw new Error(`Decision node was not found: ${decisionKey}`);
    }

    const visited = new Set<string>();
    const path: string[] = [];
    const confidences: number[] = [];

    const visit = (key: string): void => {
      if (visited.has(key)) return;
      visited.add(key);

      for (const edge of this.edges.filter((item) => item.target === key)) {
        visit(edge.source);
        confidences.push(edge.confidence);
      }

      path.push(key);
    };

    visit(decisionKey);

    const aggregateConfidence =
      confidences.length === 0
        ? 100
        : Math.round(
            confidences.reduce((sum, value) => sum + value, 0) /
              confidences.length,
          );

    return {
      decisionKey,
      path,
      aggregateConfidence,
      evidence: [
        {
          id: randomUUID(),
          systemKey,
          category: "enterprise-decision-graph",
          action: "decision.traced",
          message: `Decision ${decisionKey} traced across ${path.length} nodes.`,
          metadata: { path, aggregateConfidence },
          createdAt: new Date().toISOString(),
        },
      ],
      tracedAt: new Date().toISOString(),
    };
  }
}
