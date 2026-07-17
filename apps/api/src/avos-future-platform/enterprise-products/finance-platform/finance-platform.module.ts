import { Module } from '@nestjs/common';
import { FinancePlatformController } from './finance-platform.controller';
import { FinancePlatformService } from './finance-platform.service';

@Module({
  controllers: [FinancePlatformController],
  providers: [FinancePlatformService],
  exports: [FinancePlatformService],
})
export class FinancePlatformModule {}