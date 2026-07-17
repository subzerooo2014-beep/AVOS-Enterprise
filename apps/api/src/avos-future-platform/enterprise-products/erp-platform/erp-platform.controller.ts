import { Controller, Get } from '@nestjs/common';
import { ErpPlatformService } from './erp-platform.service';

@Controller('avos/future/enterprise-products/erp-platform')
export class ErpPlatformController {
  constructor(private readonly service: ErpPlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}