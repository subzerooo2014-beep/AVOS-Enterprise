import { Module } from '@nestjs/common';
import { AutonomousExpansionEngineController } from './autonomous-expansion-engine.controller';
import { AutonomousExpansionEngineService } from './autonomous-expansion-engine.service';

@Module({
  controllers: [AutonomousExpansionEngineController],
  providers: [AutonomousExpansionEngineService],
  exports: [AutonomousExpansionEngineService],
})
export class AutonomousExpansionEngineModule {}