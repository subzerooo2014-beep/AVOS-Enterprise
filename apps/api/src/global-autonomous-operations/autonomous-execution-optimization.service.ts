import { Injectable } from '@nestjs/common';
import { GlobalOperation } from './global-autonomous-operations.types';

@Injectable()
export class AutonomousExecutionOptimizationService {
  optimize(operations: GlobalOperation[]) {
    return [...operations]
      .map((operation) => ({
        ...operation,
        optimizationScore: Math.round(
          operation.priority * 0.6 +
            Math.max(0, 100 - operation.requiredCapacity) * 0.2 +
            Math.max(0, 100 - operation.dependencies.length * 10) * 0.2,
        ),
      }))
      .sort(
        (left, right) =>
          right.optimizationScore - left.optimizationScore,
      );
  }
}