import { Injectable } from '@nestjs/common';
import { CapacityPool } from './global-autonomous-operations.types';

@Injectable()
export class IntelligentResourceAllocationEngineService {
  allocate(requiredCapacity: number, pools: CapacityPool[]) {
    let remaining = Math.max(0, requiredCapacity);

    const allocation = [...pools]
      .sort(
        (left, right) =>
          left.unitCost - right.unitCost ||
          right.capacity -
            right.committed -
            (left.capacity - left.committed),
      )
      .map((pool) => {
        const available = Math.max(0, pool.capacity - pool.committed);
        const allocated = Math.min(available, remaining);
        remaining -= allocated;

        return {
          poolId: pool.id,
          region: pool.region,
          allocated,
          estimatedCost: allocated * pool.unitCost,
        };
      });

    return {
      allocation,
      fullyAllocated: remaining === 0,
      unallocatedCapacity: remaining,
      totalCost: allocation.reduce(
        (sum, item) => sum + item.estimatedCost,
        0,
      ),
    };
  }
}