import { Injectable } from '@nestjs/common';
import { OptimizationAction } from './enterprise-value-optimization.types';

@Injectable()
export class ContinuousOptimizationEngineService {
  prioritize(actions: OptimizationAction[]) {
    return [...actions]
      .map((action) => ({
        ...action,
        optimizationScore: Math.round(
          (action.expectedValue * action.confidence) /
            Math.max(1, action.effort),
        ),
      }))
      .sort(
        (left, right) =>
          right.optimizationScore - left.optimizationScore,
      );
  }

  select(actions: OptimizationAction[], maxEffort: number) {
    let remainingEffort = maxEffort;
    const selected: OptimizationAction[] = [];

    for (const action of this.prioritize(actions)) {
      if (action.effort <= remainingEffort) {
        selected.push(action);
        remainingEffort -= action.effort;
      }
    }

    return selected;
  }
}