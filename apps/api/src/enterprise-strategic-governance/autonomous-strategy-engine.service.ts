import { Injectable } from '@nestjs/common';
import { EnterpriseObjective } from './enterprise-strategic-governance.types';

@Injectable()
export class AutonomousStrategyEngineService {
  evaluate(
    strategyName: string,
    objectives: EnterpriseObjective[],
    constraints: string[] = [],
  ) {
    const weightedProgress =
      objectives.reduce((sum, objective) => {
        const progress =
          objective.targetValue === 0
            ? 100
            : Math.min(
                100,
                Math.max(
                  0,
                  (objective.currentValue / objective.targetValue) * 100,
                ),
              );

        return sum + progress * objective.priority;
      }, 0) /
      Math.max(
        1,
        objectives.reduce((sum, objective) => sum + objective.priority, 0),
      );

    const objectiveRisks = objectives
      .filter((objective) => {
        const progress =
          objective.targetValue === 0
            ? 100
            : (objective.currentValue / objective.targetValue) * 100;
        return progress < 60;
      })
      .map((objective) => objective.id);

    return {
      strategyName,
      score: Math.round(weightedProgress),
      objectiveCount: objectives.length,
      constraints: [...new Set(constraints)],
      objectiveRisks,
      recommendation:
        weightedProgress >= 80
          ? 'accelerate'
          : weightedProgress >= 60
            ? 'optimize'
            : 'intervene',
    };
  }
}