import { Controller, Get } from '@nestjs/common';
import { Market360Service } from './market-360.service';

@Controller('avos/future/enterprise-products/market-360')
export class Market360Controller {
  constructor(private readonly service: Market360Service) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}