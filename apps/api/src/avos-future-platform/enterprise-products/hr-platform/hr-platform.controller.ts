import { Controller, Get } from '@nestjs/common';
import { HrPlatformService } from './hr-platform.service';

@Controller('avos/future/enterprise-products/hr-platform')
export class HrPlatformController {
  constructor(private readonly service: HrPlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}