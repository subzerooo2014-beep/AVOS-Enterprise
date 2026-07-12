export interface AllianceMember {
  key: string;
  domain: string;
  trustScore: number;
  capabilityScore: number;
  governanceScore: number;
  strategicAlignment: number;
}

export interface AllianceConnection {
  left: string;
  right: string;
  compatibilityScore: number;
  trusted: boolean;
}

export interface AutonomousAllianceNetworkResult {
  connections: AllianceConnection[];
  allianceScore: number;
  trustedConnections: number;
  untrustedConnections: number;
  connectedAt: string;
}

export class AutonomousAllianceNetwork {
  connect(
    members: readonly AllianceMember[],
  ): AutonomousAllianceNetworkResult {
    const connections: AllianceConnection[] = [];

    for (let i = 0; i < members.length; i += 1) {
      const left = members[i];
      if (!left) continue;

      for (let j = i + 1; j < members.length; j += 1) {
        const right = members[j];
        if (!right) continue;

        const compatibilityScore = Math.round(
          (left.trustScore + right.trustScore) * 0.2 +
            (left.capabilityScore + right.capabilityScore) * 0.15 +
            (left.governanceScore + right.governanceScore) * 0.1 +
            (left.strategicAlignment + right.strategicAlignment) * 0.05,
        );

        connections.push({
          left: left.key,
          right: right.key,
          compatibilityScore: Math.max(0, Math.min(100, compatibilityScore)),
          trusted: compatibilityScore >= 75,
        });
      }
    }

    const allianceScore =
      connections.length === 0
        ? 100
        : Math.round(
            connections.reduce(
              (sum, connection) => sum + connection.compatibilityScore,
              0,
            ) / connections.length,
          );

    return {
      connections,
      allianceScore,
      trustedConnections: connections.filter((item) => item.trusted).length,
      untrustedConnections: connections.filter((item) => !item.trusted).length,
      connectedAt: new Date().toISOString(),
    };
  }
}
