import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CheckpointEngineService } from './checkpoint-engine.service';
import { ExecutionAnalyticsService } from './execution-analytics.service';
import { ExecutionEventBusService } from './execution-event-bus.service';
import { WorkflowCreateInput } from './execution-runtime.types';
import { Pack3Service } from './pack-3.service';
import { WorkflowRuntimeService } from './workflow-runtime.service';

@Controller('avos/platform-closure/pack-3')
export class Pack3Controller {
  constructor(
    private readonly pack: Pack3Service,
    private readonly workflows: WorkflowRuntimeService,
    private readonly checkpoints: CheckpointEngineService,
    private readonly events: ExecutionEventBusService,
    private readonly analytics: ExecutionAnalyticsService,
  ) {}

  @Get('status')
  status() {
    return this.pack.status();
  }

  @Get('dashboard')
  dashboard() {
    return this.analytics.dashboard();
  }

  @Post('workflows')
  createWorkflow(@Body() body: WorkflowCreateInput) {
    return this.workflows.create(body);
  }

  @Get('workflows')
  listWorkflows() {
    return this.workflows.list();
  }

  @Get('workflows/:id')
  getWorkflow(@Param('id') id: string) {
    return this.workflows.get(id);
  }

  @Post('workflows/:id/human-approval')
  approveWorkflow(
    @Param('id') id: string,
    @Body()
    body: {
      approvedBy: string;
      action: 'approved' | 'rejected';
    },
  ) {
    return this.workflows.approve(id, body);
  }

  @Post('workflows/:id/start')
  startWorkflow(@Param('id') id: string) {
    return this.workflows.start(id);
  }

  @Post('workflows/:workflowId/steps/:stepId/execute')
  executeStep(
    @Param('workflowId') workflowId: string,
    @Param('stepId') stepId: string,
    @Body()
    body: {
      actualCost?: number;
      fail?: boolean;
      error?: string;
    },
  ) {
    return this.workflows.executeStep(workflowId, stepId, body);
  }

  @Post('workflows/:workflowId/steps/:stepId/human-approval')
  approveStep(
    @Param('workflowId') workflowId: string,
    @Param('stepId') stepId: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.workflows.approveStep(
      workflowId,
      stepId,
      body.approvedBy,
    );
  }

  @Post('workflows/:workflowId/rollback/:checkpointId')
  rollback(
    @Param('workflowId') workflowId: string,
    @Param('checkpointId') checkpointId: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.workflows.rollback(
      workflowId,
      checkpointId,
      body.approvedBy,
    );
  }

  @Get('checkpoints')
  listCheckpoints(@Query('workflowId') workflowId?: string) {
    return this.checkpoints.list(workflowId);
  }

  @Get('events')
  listEvents(@Query('workflowId') workflowId?: string) {
    return this.events.list(workflowId);
  }
}