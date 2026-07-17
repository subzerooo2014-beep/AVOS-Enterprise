import { Module } from '@nestjs/common';
import { CompatibilityIntelligenceController } from './compatibility-intelligence.controller';
import { CompatibilityIntelligenceService } from './compatibility-intelligence.service';

@Module({
  controllers: [CompatibilityIntelligenceController],
  providers: [CompatibilityIntelligenceService],
  exports: [CompatibilityIntelligenceService],
})
export class CompatibilityIntelligenceModule {}