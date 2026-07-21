import { Module } from '@nestjs/common';
import { StrategyPlanningService } from './strategy-planning.service';

@Module({
  providers: [StrategyPlanningService],
  exports: [StrategyPlanningService],
})
export class StrategyPlanningModule {}
