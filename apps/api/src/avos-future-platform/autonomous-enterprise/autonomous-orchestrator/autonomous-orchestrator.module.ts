import { Module } from '@nestjs/common';
import { AutonomousOrchestratorController } from './autonomous-orchestrator.controller';
import { AutonomousOrchestratorService } from './autonomous-orchestrator.service';

@Module({
  controllers: [AutonomousOrchestratorController],
  providers: [AutonomousOrchestratorService],
  exports: [AutonomousOrchestratorService],
})
export class AutonomousOrchestratorModule {}