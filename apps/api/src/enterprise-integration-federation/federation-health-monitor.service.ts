import { Injectable } from '@nestjs/common';
import { FederationNode } from './enterprise-integration-federation.types';

@Injectable()
export class FederationHealthMonitorService {
  monitor(nodes: FederationNode[]) {
    const evaluated = nodes.map((node) => ({
      ...node,
      federationScore: Math.round(
        node.trustScore * 0.5 + node.healthScore * 0.5,
      ),
      healthy: node.trustScore >= 70 && node.healthScore >= 70,
    }));

    return {
      nodes: evaluated,
      health: Math.round(
        evaluated.reduce((sum, node) => sum + node.federationScore, 0) /
          Math.max(1, evaluated.length),
      ),
      unhealthyNodes: evaluated
        .filter((node) => !node.healthy)
        .map((node) => node.id),
    };
  }
}