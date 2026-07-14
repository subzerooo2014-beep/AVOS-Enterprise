import { Injectable } from '@nestjs/common';
import { ResourcePool } from './autonomous-enterprise-operations.types';

@Injectable()
export class AdaptiveResourceAllocationService {
  allocate(
    requiredCapacity: number,
    resources: ResourcePool[],
  ): Record<string, number> {
    let remaining = Math.max(0, requiredCapacity);
    const allocation: Record<string, number> = {};

    for (const resource of [...resources].sort(
      (left, right) =>
        right.available -
        right.committed -
        (left.available - left.committed),
    )) {
      if (remaining <= 0) {
        allocation[resource.name] = 0;
        continue;
      }

      const free = Math.max(0, resource.available - resource.committed);
      const assigned = Math.min(free, remaining);
      allocation[resource.name] = assigned;
      remaining -= assigned;
    }

    return allocation;
  }

  totalAllocated(allocation: Record<string, number>): number {
    return Object.values(allocation).reduce((sum, value) => sum + value, 0);
  }
}