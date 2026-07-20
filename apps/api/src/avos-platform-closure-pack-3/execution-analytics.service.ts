import { Injectable } from '@nestjs/common';
import { CheckpointEngineService } from './checkpoint-engine.service';
import { ExecutionEventBusService } from './execution-event-bus.service';
import { WorkflowRuntimeService } from './workflow-runtime.service';

@Injectable()
export class ExecutionAnalyticsService {
  constructor(
    private readonly workflows: WorkflowRuntimeService,
    private readonly checkpoints: CheckpointEngineService,
    private readonly events: ExecutionEventBusService,
  ) {}

  dashboard() {
    const workflows = this.workflows.list();
    const steps = workflows.flatMap((workflow) => workflow.steps);
    const events = this.events.list();

    return {
      workflows: workflows.length,
      running: workflows.filter((workflow) => workflow.status === 'running').length,
      completed: workflows.filter((workflow) => workflow.status === 'completed').length,
      failed: workflows.filter((workflow) => workflow.status === 'failed').length,
      steps: steps.length,
      completedSteps: steps.filter((step) => step.status === 'completed').length,
      failedSteps: steps.filter((step) => step.status === 'failed').length,
      checkpoints: this.checkpoints.list().length,
      retries: steps.reduce((sum, step) => sum + step.retryCount, 0),
      humanEscalations: events.filter(
        (event) => event.type === 'human-escalation',
      ).length,
      totalEstimatedCost: steps.reduce(
        (sum, step) => sum + step.estimatedCost,
        0,
      ),
      totalActualCost: steps.reduce((sum, step) => sum + step.actualCost, 0),
      events: events.length,
    };
  }
}