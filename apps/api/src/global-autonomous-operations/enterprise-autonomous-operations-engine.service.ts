import { Injectable } from '@nestjs/common';
import {
  CapacityPool,
  GlobalOperation,
} from './global-autonomous-operations.types';

@Injectable()
export class EnterpriseAutonomousOperationsEngineService {
  evaluate(operation: GlobalOperation, pools: CapacityPool[]) {
    const regionalPools = pools.filter(
      (pool) => pool.region === operation.region,
    );
    const availableCapacity = regionalPools.reduce(
      (sum, pool) => sum + Math.max(0, pool.capacity - pool.committed),
      0,
    );
    const dependencyPenalty = operation.dependencies.length * 5;
    const readinessScore = Math.max(
      0,
      Math.min(
        100,
        (availableCapacity / Math.max(1, operation.requiredCapacity)) * 100 -
          dependencyPenalty,
      ),
    );

    return {
      operation,
      availableCapacity,
      readinessScore: Math.round(readinessScore),
      executable:
        availableCapacity >= operation.requiredCapacity &&
        readinessScore >= 65,
      targetStatus:
        availableCapacity >= operation.requiredCapacity &&
        readinessScore >= 65
          ? 'scheduled'
          : 'blocked',
    };
  }
}