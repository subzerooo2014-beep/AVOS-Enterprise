import { Controller, Get } from '@nestjs/common';
import { Customer360Service } from './customer-360.service';

@Controller('avos/future/enterprise-products/customer-360')
export class Customer360Controller {
  constructor(private readonly service: Customer360Service) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}