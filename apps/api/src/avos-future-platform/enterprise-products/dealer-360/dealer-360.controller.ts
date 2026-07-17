import { Controller, Get } from '@nestjs/common';
import { Dealer360Service } from './dealer-360.service';

@Controller('avos/future/enterprise-products/dealer-360')
export class Dealer360Controller {
  constructor(private readonly service: Dealer360Service) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}