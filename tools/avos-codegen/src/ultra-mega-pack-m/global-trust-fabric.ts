export interface TrustFabricNode {
  key: string;
  domain: string;
  directTrust: number;
  evidenceTrust: number;
  relationshipTrust: number;
  peers: string[];
}

export interface TrustFabricAssessment {
  nodeKey: string;
  propagatedTrust: number;
  trusted: boolean;
}

export interface GlobalTrustFabricResult {
  assessments: TrustFabricAssessment[];
  fabricTrustScore: number;
  trustedNodes: number;
  untrustedNodes: number;
  evaluatedAt: string;
}

export class GlobalTrustFabric {
  evaluate(
    nodes: readonly TrustFabricNode[],
  ): GlobalTrustFabricResult {
    const nodeMap = new Map(nodes.map((node) => [node.key, node]));

    const assessments = nodes.map((node): TrustFabricAssessment => {
      const peerTrust =
        node.peers.length === 0
          ? 100
          : Math.round(
              node.peers.reduce(
                (sum, peerKey) => sum + (nodeMap.get(peerKey)?.directTrust ?? 50),
                0,
              ) / node.peers.length,
            );

      const propagatedTrust = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            node.directTrust * 0.35 +
              node.evidenceTrust * 0.3 +
              node.relationshipTrust * 0.2 +
              peerTrust * 0.15,
          ),
        ),
      );

      return {
        nodeKey: node.key,
        propagatedTrust,
        trusted: propagatedTrust >= 75,
      };
    });

    const fabricTrustScore =
      assessments.length === 0
        ? 100
        : Math.round(
            assessments.reduce(
              (sum, assessment) => sum + assessment.propagatedTrust,
              0,
            ) / assessments.length,
          );

    return {
      assessments,
      fabricTrustScore,
      trustedNodes: assessments.filter((item) => item.trusted).length,
      untrustedNodes: assessments.filter((item) => !item.trusted).length,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
