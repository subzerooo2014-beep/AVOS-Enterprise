export interface DecisionMeshNode {
  key: string;
  domain: string;
  authority: number;
  reliability: number;
  recommendation: "approve" | "approve_with_controls" | "review" | "reject";
}

export interface GlobalDecisionMeshResult {
  decision: DecisionMeshNode["recommendation"];
  consensus: number;
  participatingNodes: number;
  dissentingNodes: string[];
  controls: string[];
  decidedAt: string;
}

export class GlobalDecisionMesh {
  decide(
    nodes: readonly DecisionMeshNode[],
  ): GlobalDecisionMeshResult {
    if (nodes.length === 0) {
      return {
        decision: "review",
        consensus: 0,
        participatingNodes: 0,
        dissentingNodes: [],
        controls: ["human-review"],
        decidedAt: new Date().toISOString(),
      };
    }

    const weights = {
      approve: 4,
      approve_with_controls: 3,
      review: 2,
      reject: 1,
    } as const;

    const scores = new Map<string, number>();

    for (const node of nodes) {
      const score =
        weights[node.recommendation] *
        (node.authority * 0.6 + node.reliability * 0.4);
      scores.set(
        node.recommendation,
        (scores.get(node.recommendation) ?? 0) + score,
      );
    }

    const ranked = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
    const decision = (ranked[0]?.[0] ?? "review") as DecisionMeshNode["recommendation"];
    const total = ranked.reduce((sum, entry) => sum + entry[1], 0);
    const consensus =
      total === 0
        ? 0
        : Math.round(((ranked[0]?.[1] ?? 0) / total) * 100);

    return {
      decision,
      consensus,
      participatingNodes: nodes.length,
      dissentingNodes: nodes
        .filter((node) => node.recommendation !== decision)
        .map((node) => node.key),
      controls:
        decision === "approve"
          ? ["continuous-observability"]
          : decision === "approve_with_controls"
            ? ["progressive-delivery", "automatic-rollback"]
            : ["human-review"],
      decidedAt: new Date().toISOString(),
    };
  }
}
