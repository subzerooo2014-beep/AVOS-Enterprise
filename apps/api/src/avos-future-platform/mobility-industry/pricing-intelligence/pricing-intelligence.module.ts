import { Module } from '@nestjs/common';
import { PricingIntelligenceController } from './pricing-intelligence.controller';
import { PricingIntelligenceService } from './pricing-intelligence.service';

@Module({
  controllers: [PricingIntelligenceController],
  providers: [PricingIntelligenceService],
  exports: [PricingIntelligenceService],
})
export class PricingIntelligenceModule {}