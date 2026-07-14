import { Injectable } from '@nestjs/common';
import {
  EnterpriseObjective,
  ObjectiveStatus,
} from './enterprise-strategic-governance.types';

@Injectable()
export class EnterpriseObjectiveManagementService {
  normalize(objective: EnterpriseObjective): EnterpriseObjective {
    const progress =
      objective.targetValue === 0
        ? 100
        : (objective.currentValue / objective.targetValue) * 100;

    const status: ObjectiveStatus =
      progress >= 100 ? 'completed' : progress < 50 ? 'at-risk' : 'active';

    return {
      ...objective,
      status,
    };
  }

  portfolioProgress(objectives: EnterpriseObjective[]): number {
    const normalized = objectives.map((objective) => this.normalize(objective));

    return Math.round(
      normalized.reduce((sum, objective) => {
        const progress =
          objective.targetValue === 0
            ? 100
            : Math.min(
                100,
                (objective.currentValue / objective.targetValue) * 100,
              );
        return sum + progress;
      }, 0) / Math.max(1, normalized.length),
    );
  }
}