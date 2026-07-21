import { Module } from '@nestjs/common';
import { ContinuousEvolutionIntelligenceService } from './continuous-evolution-intelligence.service';

@Module({
  providers: [ContinuousEvolutionIntelligenceService],
  exports: [ContinuousEvolutionIntelligenceService],
})
export class ContinuousEvolutionIntelligenceModule {}
