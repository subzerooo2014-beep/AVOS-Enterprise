import { Module } from '@nestjs/common';
import { VehicleIntelligencePlatformController } from './vehicle-intelligence-platform.controller';
import { VehicleIntelligencePlatformService } from './vehicle-intelligence-platform.service';

@Module({
  controllers: [VehicleIntelligencePlatformController],
  providers: [VehicleIntelligencePlatformService],
  exports: [VehicleIntelligencePlatformService],
})
export class VehicleIntelligencePlatformModule {}