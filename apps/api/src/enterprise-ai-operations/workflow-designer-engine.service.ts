import { Injectable } from '@nestjs/common';
import { WorkflowDefinition } from './enterprise-ai-operations.types';

@Injectable()
export class WorkflowDesignerEngineService {
  validate(definition: WorkflowDefinition) {
    const ids = new Set(definition.steps.map((step) => step.id));
    const duplicates =
      ids.size !== definition.steps.length;
    const missingDependencies = definition.steps.flatMap((step) =>
      step.dependsOn
        .filter((dependency) => !ids.has(dependency))
        .map((dependency) => `${step.id}:${dependency}`),
    );

    return {
      valid: !duplicates && missingDependencies.length === 0,
      duplicates,
      missingDependencies,
      stepCount: definition.steps.length,
    };
  }
}