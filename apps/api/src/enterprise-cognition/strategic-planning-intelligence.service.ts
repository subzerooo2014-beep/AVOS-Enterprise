import { Injectable } from '@nestjs/common';
import { StrategicPlan } from './enterprise-cognition.types';

@Injectable()
export class StrategicPlanningIntelligenceService {
  createPlan(
    objective: string,
    insights: string[],
    horizonDays = 90,
  ): StrategicPlan {
    const priorities = insights.slice(0, 5);
    const actions = priorities.map(
      (priority, index) => `Action ${index + 1}: operationalize ${priority}`,
    );

    return {
      id: `plan-${Date.now()}`,
      objective,
      horizonDays,
      priorities,
      actions,
      risks: [
        'insufficient evidence coverage',
        'cross-domain dependency conflict',
        'execution capacity constraint',
      ],
      expectedImpact: Math.min(100, 60 + priorities.length * 6),
    };
  }
}