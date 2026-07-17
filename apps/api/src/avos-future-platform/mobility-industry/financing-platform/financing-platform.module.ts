import { Module } from '@nestjs/common';
import { FinancingPlatformController } from './financing-platform.controller';
import { FinancingPlatformService } from './financing-platform.service';

@Module({
  controllers: [FinancingPlatformController],
  providers: [FinancingPlatformService],
  exports: [FinancingPlatformService],
})
export class FinancingPlatformModule {}