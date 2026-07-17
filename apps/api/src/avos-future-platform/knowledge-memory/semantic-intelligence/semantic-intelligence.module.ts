import { Module } from '@nestjs/common';
import { SemanticIntelligenceController } from './semantic-intelligence.controller';
import { SemanticIntelligenceService } from './semantic-intelligence.service';

@Module({
  controllers: [SemanticIntelligenceController],
  providers: [SemanticIntelligenceService],
  exports: [SemanticIntelligenceService],
})
export class SemanticIntelligenceModule {}