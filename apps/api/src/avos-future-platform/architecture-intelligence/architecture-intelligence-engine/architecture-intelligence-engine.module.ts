import { Module } from '@nestjs/common';
import { ArchitectureIntelligenceEngineController } from './architecture-intelligence-engine.controller';
import { ArchitectureIntelligenceEngineService } from './architecture-intelligence-engine.service';

@Module({
  controllers: [ArchitectureIntelligenceEngineController],
  providers: [ArchitectureIntelligenceEngineService],
  exports: [ArchitectureIntelligenceEngineService],
})
export class ArchitectureIntelligenceEngineModule {}