import { Module } from '@nestjs/common';
import { DependencyGraphIntelligenceController } from './dependency-graph-intelligence.controller';
import { DependencyGraphIntelligenceService } from './dependency-graph-intelligence.service';

@Module({
  controllers: [DependencyGraphIntelligenceController],
  providers: [DependencyGraphIntelligenceService],
  exports: [DependencyGraphIntelligenceService],
})
export class DependencyGraphIntelligenceModule {}