export interface TrustNode {
  key: string;
  domain: string;
  identityScore: number;
  behaviorScore: number;
  evidenceScore: number;
  incidents: number;
}

export interface TrustAssessment {
  nodeKey: string;
  trustScore: number;
  trusted: boolean;
  riskLevel: "low" | "medium" | "high";
}

export interface AutonomousTrustNetworkResult {
  assessments: TrustAssessment[];
  networkTrustScore: number;
  trustedNodes: number;
  untrustedNodes: number;
  assessedAt: string;
}

export class AutonomousTrustNetwork {
  assess(nodes: readonly TrustNode[]): AutonomousTrustNetworkResult {
    const assessments = nodes.map((node): TrustAssessment => {
      const trustScore = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            node.identityScore * 0.3 +
              node.behaviorScore * 0.35 +
              node.evidenceScore * 0.35 -
              node.incidents * 8,
          ),
        ),
      );

      return {
        nodeKey: node.key,
        trustScore,
        trusted: trustScore >= 75,
        riskLevel:
          trustScore >= 85 ? "low" : trustScore >= 65 ? "medium" : "high",
      };
    });

    const networkTrustScore =
      assessments.length === 0
        ? 100
        : Math.round(
            assessments.reduce(
              (sum, assessment) => sum + assessment.trustScore,
              0,
            ) / assessments.length,
          );

    return {
      assessments,
      networkTrustScore,
      trustedNodes: assessments.filter((item) => item.trusted).length,
      untrustedNodes: assessments.filter((item) => !item.trusted).length,
      assessedAt: new Date().toISOString(),
    };
  }
}
