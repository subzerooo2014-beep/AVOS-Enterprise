import { Module } from '@nestjs/common';
import { StrategyPlanningModule } from './strategy/strategy-planning.module';
import { SoftwareDevelopmentOsUltimateController } from './software-development-os-ultimate.controller';
import { SoftwareDevelopmentOsUltimateOrchestratorService } from './software-development-os-ultimate-orchestrator.service';

@Module({
  imports: [
    StrategyPlanningModule,
  ],
  controllers: [SoftwareDevelopmentOsUltimateController],
  providers: [SoftwareDevelopmentOsUltimateOrchestratorService],
  exports: [SoftwareDevelopmentOsUltimateOrchestratorService],
})
export class SoftwareDevelopmentOsUltimateModule {}
