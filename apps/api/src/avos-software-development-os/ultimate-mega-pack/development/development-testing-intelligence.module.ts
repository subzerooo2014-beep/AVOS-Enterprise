import { Module } from '@nestjs/common';
import { DevelopmentTestingIntelligenceService } from './development-testing-intelligence.service';

@Module({
  providers: [DevelopmentTestingIntelligenceService],
  exports: [DevelopmentTestingIntelligenceService],
})
export class DevelopmentTestingIntelligenceModule {}
