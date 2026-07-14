import { Injectable } from '@nestjs/common';
import { ServiceNode } from './global-autonomous-operations.types';

@Injectable()
export class EnterpriseServiceOrchestrationEngineService {
  orchestrate(nodes: ServiceNode[]) {
    const grouped = new Map<string, ServiceNode[]>();

    for (const node of nodes) {
      const existing = grouped.get(node.service) ?? [];
      existing.push(node);
      grouped.set(node.service, existing);
    }

    const routes = [...grouped.entries()].map(([service, serviceNodes]) => {
      const ranked = [...serviceNodes].sort(
        (left, right) =>
          right.health - left.health ||
          left.latency - right.latency ||
          right.capacity - left.capacity,
      );

      return {
        service,
        primaryNode: ranked[0]?.id ?? null,
        fallbackNodes: ranked.slice(1).map((node) => node.id),
        healthy: (ranked[0]?.health ?? 0) >= 70,
      };
    });

    return {
      routes,
      healthyServices: routes
        .filter((route) => route.healthy)
        .map((route) => route.service),
    };
  }
}