import { Controller, Get } from '@nestjs/common';
import { WorkshopPlatformService } from './workshop-platform.service';

@Controller('avos/future/mobility-industry/workshop-platform')
export class WorkshopPlatformController {
  constructor(private readonly service: WorkshopPlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}