import { Module } from '@nestjs/common';
import { HrPlatformController } from './hr-platform.controller';
import { HrPlatformService } from './hr-platform.service';

@Module({
  controllers: [HrPlatformController],
  providers: [HrPlatformService],
  exports: [HrPlatformService],
})
export class HrPlatformModule {}