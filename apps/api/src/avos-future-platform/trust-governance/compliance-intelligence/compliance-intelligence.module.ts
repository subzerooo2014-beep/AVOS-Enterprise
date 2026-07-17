import { Module } from '@nestjs/common';
import { ComplianceIntelligenceController } from './compliance-intelligence.controller';
import { ComplianceIntelligenceService } from './compliance-intelligence.service';

@Module({
  controllers: [ComplianceIntelligenceController],
  providers: [ComplianceIntelligenceService],
  exports: [ComplianceIntelligenceService],
})
export class ComplianceIntelligenceModule {}