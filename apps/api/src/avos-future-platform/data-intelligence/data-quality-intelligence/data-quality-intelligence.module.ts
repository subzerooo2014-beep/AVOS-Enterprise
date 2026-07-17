import { Module } from '@nestjs/common';
import { DataQualityIntelligenceController } from './data-quality-intelligence.controller';
import { DataQualityIntelligenceService } from './data-quality-intelligence.service';

@Module({
  controllers: [DataQualityIntelligenceController],
  providers: [DataQualityIntelligenceService],
  exports: [DataQualityIntelligenceService],
})
export class DataQualityIntelligenceModule {}