import { Injectable } from '@nestjs/common';
import {
  WorkflowDefinition,
  WorkflowExecution,
} from './enterprise-ai-operations.types';

@Injectable()
export class AutonomousWorkflowEngineService {
  execute(definition: WorkflowDefinition): WorkflowExecution {
    const hasBrokenDependencies = definition.steps.some((step) =>
      step.dependsOn.some(
        (dependency) =>
          !definition.steps.some((candidate) => candidate.id === dependency),
      ),
    );

    return {
      id: `${definition.id}-execution`,
      workflowId: definition.id,
      status: hasBrokenDependencies ? 'failed' : 'completed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      completedSteps: hasBrokenDependencies
        ? []
        : definition.steps.map((step) => step.id),
      failedSteps: hasBrokenDependencies
        ? definition.steps
            .filter((step) =>
              step.dependsOn.some(
                (dependency) =>
                  !definition.steps.some(
                    (candidate) => candidate.id === dependency,
                  ),
              ),
            )
            .map((step) => step.id)
        : [],
    };
  }
}