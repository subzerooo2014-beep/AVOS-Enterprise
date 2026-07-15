import { Injectable } from '@nestjs/common';
import { WorkflowDefinition } from './enterprise-ai-operations.types';

@Injectable()
export class EventDrivenAutomationEngineService {
  match(eventType: string, workflows: WorkflowDefinition[]) {
    return workflows.filter(
      (workflow) =>
        workflow.status === 'active' &&
        workflow.triggers.includes(eventType),
    );
  }
}