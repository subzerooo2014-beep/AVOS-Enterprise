import { Controller, Get } from '@nestjs/common';
import { ExecutiveCockpitService } from './executive-cockpit.service';

@Controller('avos/future/enterprise-products/executive-cockpit')
export class ExecutiveCockpitController {
  constructor(private readonly service: ExecutiveCockpitService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}