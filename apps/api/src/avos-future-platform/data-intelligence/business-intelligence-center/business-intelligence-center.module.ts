import { Module } from '@nestjs/common';
import { BusinessIntelligenceCenterController } from './business-intelligence-center.controller';
import { BusinessIntelligenceCenterService } from './business-intelligence-center.service';

@Module({
  controllers: [BusinessIntelligenceCenterController],
  providers: [BusinessIntelligenceCenterService],
  exports: [BusinessIntelligenceCenterService],
})
export class BusinessIntelligenceCenterModule {}