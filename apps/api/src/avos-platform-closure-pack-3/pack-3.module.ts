import { Module } from '@nestjs/common';
import { Pack2Module } from '../avos-platform-closure-pack-2/pack-2.module';
import { CheckpointEngineService } from './checkpoint-engine.service';
import { ExecutionAnalyticsService } from './execution-analytics.service';
import { ExecutionEventBusService } from './execution-event-bus.service';
import { GoalDecompositionService } from './goal-decomposition.service';
import { Pack3Controller } from './pack-3.controller';
import { Pack3Service } from './pack-3.service';
import { WorkflowRuntimeService } from './workflow-runtime.service';

@Module({
  imports: [Pack2Module],
  controllers: [Pack3Controller],
  providers: [
    GoalDecompositionService,
    CheckpointEngineService,
    ExecutionEventBusService,
    WorkflowRuntimeService,
    ExecutionAnalyticsService,
    Pack3Service,
  ],
  exports: [
    WorkflowRuntimeService,
    CheckpointEngineService,
    ExecutionEventBusService,
    ExecutionAnalyticsService,
    Pack3Service,
  ],
})
export class Pack3Module {}