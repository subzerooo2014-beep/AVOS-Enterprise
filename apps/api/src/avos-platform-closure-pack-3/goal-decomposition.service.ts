import { Injectable } from '@nestjs/common';
import { WorkflowStepInput } from './execution-runtime.types';

@Injectable()
export class GoalDecompositionService {
  decompose(goal: string): WorkflowStepInput[] {
    return [
      {
        name: 'Analyze goal',
        capability: 'architecture-analysis',
        description: `Analyze execution goal: ${goal}`,
        maxRetries: 2,
        estimatedCost: 1,
      },
      {
        name: 'Gather evidence',
        capability: 'research',
        description: `Gather evidence required to execute: ${goal}`,
        dependsOn: ['Analyze goal'],
        maxRetries: 2,
        estimatedCost: 1,
      },
      {
        name: 'Produce execution result',
        capability: 'task-planning',
        description: `Produce governed execution result for: ${goal}`,
        dependsOn: ['Analyze goal', 'Gather evidence'],
        requiresHumanApproval: true,
        maxRetries: 1,
        estimatedCost: 2,
      },
    ];
  }
}