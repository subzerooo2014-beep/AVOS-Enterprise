import { Injectable } from '@nestjs/common';
import {
  AiTask,
  EnterpriseAgent,
  OperationalMetric,
  WorkflowDefinition,
} from './enterprise-ai-operations.types';
import { AutonomousWorkflowEngineService } from './autonomous-workflow-engine.service';
import { IntelligentTaskOrchestratorService } from './intelligent-task-orchestrator.service';
import { AiOperationsEngineService } from './ai-operations-engine.service';
import { AiProcessOptimizationEngineService } from './ai-process-optimization-engine.service';
import { PredictiveOperationsEngineService } from './predictive-operations-engine.service';

@Injectable()
export class AiOperationsOrchestratorService {
  constructor(
    private readonly workflows: AutonomousWorkflowEngineService,
    private readonly tasks: IntelligentTaskOrchestratorService,
    private readonly operations: AiOperationsEngineService,
    private readonly optimization: AiProcessOptimizationEngineService,
    private readonly prediction: PredictiveOperationsEngineService,
  ) {}

  run(input: {
    workflow: WorkflowDefinition;
    tasks: AiTask[];
    agents: EnterpriseAgent[];
    metrics: OperationalMetric[];
  }) {
    return {
      workflow: this.workflows.execute(input.workflow),
      taskAssignments: this.tasks.assign(input.tasks, input.agents),
      operations: this.operations.evaluate(input.tasks, input.metrics),
      optimization: this.optimization.optimize(input.metrics),
      prediction: this.prediction.forecast(input.metrics),
    };
  }
}