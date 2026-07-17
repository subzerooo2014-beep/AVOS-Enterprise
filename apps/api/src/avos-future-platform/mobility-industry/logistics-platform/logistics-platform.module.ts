import { Module } from '@nestjs/common';
import { LogisticsPlatformController } from './logistics-platform.controller';
import { LogisticsPlatformService } from './logistics-platform.service';

@Module({
  controllers: [LogisticsPlatformController],
  providers: [LogisticsPlatformService],
  exports: [LogisticsPlatformService],
})
export class LogisticsPlatformModule {}