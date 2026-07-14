import { Injectable } from '@nestjs/common';
import {
  CapacityPool,
  GlobalOperation,
  ServiceNode,
} from './global-autonomous-operations.types';

@Injectable()
export class GlobalOperationsIntelligenceService {
  analyze(
    operations: GlobalOperation[],
    pools: CapacityPool[],
    nodes: ServiceNode[],
  ) {
    const active = operations.filter(
      (operation) => operation.status === 'running',
    ).length;
    const blocked = operations.filter(
      (operation) => operation.status === 'blocked',
    ).length;
    const availableCapacity = pools.reduce(
      (sum, pool) => sum + Math.max(0, pool.capacity - pool.committed),
      0,
    );
    const serviceHealth = Math.round(
      nodes.reduce((sum, node) => sum + node.health, 0) /
        Math.max(1, nodes.length),
    );

    return {
      active,
      blocked,
      availableCapacity,
      serviceHealth,
      globalReadiness: Math.max(
        0,
        Math.min(
          100,
          Math.round(
            serviceHealth * 0.6 +
              Math.min(100, availableCapacity) * 0.4 -
              blocked * 5,
          ),
        ),
      ),
    };
  }
}