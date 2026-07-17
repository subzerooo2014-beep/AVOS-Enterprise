import { Controller, Get } from '@nestjs/common';
import { CrmPlatformService } from './crm-platform.service';

@Controller('avos/future/enterprise-products/crm-platform')
export class CrmPlatformController {
  constructor(private readonly service: CrmPlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}