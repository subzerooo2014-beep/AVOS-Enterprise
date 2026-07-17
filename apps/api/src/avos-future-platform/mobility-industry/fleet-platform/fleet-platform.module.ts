import { Module } from '@nestjs/common';
import { FleetPlatformController } from './fleet-platform.controller';
import { FleetPlatformService } from './fleet-platform.service';

@Module({
  controllers: [FleetPlatformController],
  providers: [FleetPlatformService],
  exports: [FleetPlatformService],
})
export class FleetPlatformModule {}