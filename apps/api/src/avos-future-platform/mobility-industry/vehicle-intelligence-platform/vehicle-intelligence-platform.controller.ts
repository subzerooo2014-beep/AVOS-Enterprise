import { Controller, Get } from '@nestjs/common';
import { VehicleIntelligencePlatformService } from './vehicle-intelligence-platform.service';

@Controller('avos/future/mobility-industry/vehicle-intelligence-platform')
export class VehicleIntelligencePlatformController {
  constructor(private readonly service: VehicleIntelligencePlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}