import { Module } from '@nestjs/common';
import { SecurityIntelligenceCenterController } from './security-intelligence-center.controller';
import { SecurityIntelligenceCenterService } from './security-intelligence-center.service';

@Module({
  controllers: [SecurityIntelligenceCenterController],
  providers: [SecurityIntelligenceCenterService],
  exports: [SecurityIntelligenceCenterService],
})
export class SecurityIntelligenceCenterModule {}