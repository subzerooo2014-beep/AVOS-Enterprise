import { Module } from '@nestjs/common';
import { WorkshopPlatformController } from './workshop-platform.controller';
import { WorkshopPlatformService } from './workshop-platform.service';

@Module({
  controllers: [WorkshopPlatformController],
  providers: [WorkshopPlatformService],
  exports: [WorkshopPlatformService],
})
export class WorkshopPlatformModule {}