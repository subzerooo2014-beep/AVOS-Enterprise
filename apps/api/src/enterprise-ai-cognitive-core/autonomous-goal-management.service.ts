import { Injectable } from '@nestjs/common';
import { AutonomousGoal } from './enterprise-ai-cognitive-core.types';

@Injectable()
export class AutonomousGoalManagementService {
  evaluate(goals: AutonomousGoal[]) {
    return [...goals]
      .map((goal) => {
        const progress =
          goal.targetValue === 0
            ? 100
            : Math.max(
                0,
                Math.min(
                  100,
                  (goal.currentValue / goal.targetValue) * 100,
                ),
              );
        const overdue =
          new Date(goal.dueDate).getTime() < Date.now() &&
          progress < 100;

        return {
          ...goal,
          progress: Math.round(progress),
          overdue,
          attentionRequired:
            overdue || progress < 50 || goal.dependencies.length > 3,
        };
      })
      .sort(
        (left, right) =>
          Number(right.attentionRequired) -
            Number(left.attentionRequired) ||
          right.priority - left.priority,
      );
  }
}