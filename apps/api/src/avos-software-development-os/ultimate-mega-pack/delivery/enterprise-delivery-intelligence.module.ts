import { Module } from '@nestjs/common';
import { EnterpriseDeliveryIntelligenceService } from './enterprise-delivery-intelligence.service';

@Module({
  providers: [EnterpriseDeliveryIntelligenceService],
  exports: [EnterpriseDeliveryIntelligenceService],
})
export class EnterpriseDeliveryIntelligenceModule {}
