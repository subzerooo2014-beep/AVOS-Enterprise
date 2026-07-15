import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkflowDefinitionDto } from './dto/workflow-definition.dto';
import { AiTaskDto } from './dto/ai-task.dto';
import { EnterpriseAgentDto } from './dto/enterprise-agent.dto';
import { WorkflowDesignerEngineService } from './workflow-designer-engine.service';
import { IntelligentTaskOrchestratorService } from './intelligent-task-orchestrator.service';
import { OperationsCenterDashboardService } from './operations-center-dashboard.service';
import { ENTERPRISE_AI_OPERATIONS_CAPABILITIES } from './enterprise-ai-operations.types';

@Controller('enterprise-ai-operations')
export class EnterpriseAiOperationsController {
  constructor(
    private readonly workflowDesigner: WorkflowDesignerEngineService,
    private readonly taskOrchestrator: IntelligentTaskOrchestratorService,
    private readonly dashboard: OperationsCenterDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle X — Enterprise AI Operations, Automation & Autonomous Workflows',
      count: ENTERPRISE_AI_OPERATIONS_CAPABILITIES.length,
      capabilities: ENTERPRISE_AI_OPERATIONS_CAPABILITIES,
    };
  }

  @Post('workflows/validate')
  validateWorkflow(@Body() input: WorkflowDefinitionDto) {
    return this.workflowDesigner.validate(input);
  }

  @Post('tasks/assign')
  assignTasks(
    @Body()
    input: {
      tasks: AiTaskDto[];
      agents: EnterpriseAgentDto[];
    },
  ) {
    return this.taskOrchestrator.assign(
      input.tasks,
      input.agents,
    );
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}