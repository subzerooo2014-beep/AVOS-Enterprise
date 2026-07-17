import { Controller, Get } from '@nestjs/common';
import { FinancePlatformService } from './finance-platform.service';

@Controller('avos/future/enterprise-products/finance-platform')
export class FinancePlatformController {
  constructor(private readonly service: FinancePlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}