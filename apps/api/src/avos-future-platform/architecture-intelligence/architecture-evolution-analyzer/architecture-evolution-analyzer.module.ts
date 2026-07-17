import { Module } from '@nestjs/common';
import { ArchitectureEvolutionAnalyzerController } from './architecture-evolution-analyzer.controller';
import { ArchitectureEvolutionAnalyzerService } from './architecture-evolution-analyzer.service';

@Module({
  controllers: [ArchitectureEvolutionAnalyzerController],
  providers: [ArchitectureEvolutionAnalyzerService],
  exports: [ArchitectureEvolutionAnalyzerService],
})
export class ArchitectureEvolutionAnalyzerModule {}