import { Controller, Get } from '@nestjs/common';
import { FleetPlatformService } from './fleet-platform.service';

@Controller('avos/future/mobility-industry/fleet-platform')
export class FleetPlatformController {
  constructor(private readonly service: FleetPlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}