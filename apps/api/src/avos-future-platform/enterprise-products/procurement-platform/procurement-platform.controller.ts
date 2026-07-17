import { Controller, Get } from '@nestjs/common';
import { ProcurementPlatformService } from './procurement-platform.service';

@Controller('avos/future/enterprise-products/procurement-platform')
export class ProcurementPlatformController {
  constructor(private readonly service: ProcurementPlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}