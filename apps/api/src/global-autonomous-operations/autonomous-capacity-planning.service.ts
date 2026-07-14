import { Injectable } from '@nestjs/common';
import { CapacityPool } from './global-autonomous-operations.types';

@Injectable()
export class AutonomousCapacityPlanningService {
  plan(
    pools: CapacityPool[],
    expectedGrowthPercent: number,
    reservePercent = 20,
  ) {
    const currentCapacity = pools.reduce(
      (sum, pool) => sum + pool.capacity,
      0,
    );
    const committedCapacity = pools.reduce(
      (sum, pool) => sum + pool.committed,
      0,
    );
    const projectedDemand =
      committedCapacity * (1 + expectedGrowthPercent / 100);
    const requiredCapacity =
      projectedDemand * (1 + reservePercent / 100);
    const capacityGap = Math.max(0, requiredCapacity - currentCapacity);

    return {
      currentCapacity,
      committedCapacity,
      projectedDemand: Math.round(projectedDemand),
      requiredCapacity: Math.round(requiredCapacity),
      capacityGap: Math.round(capacityGap),
      expansionRequired: capacityGap > 0,
    };
  }
}