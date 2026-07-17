import { Module } from '@nestjs/common';
import { UpgradeIntelligenceController } from './upgrade-intelligence.controller';
import { UpgradeIntelligenceService } from './upgrade-intelligence.service';

@Module({
  controllers: [UpgradeIntelligenceController],
  providers: [UpgradeIntelligenceService],
  exports: [UpgradeIntelligenceService],
})
export class UpgradeIntelligenceModule {}