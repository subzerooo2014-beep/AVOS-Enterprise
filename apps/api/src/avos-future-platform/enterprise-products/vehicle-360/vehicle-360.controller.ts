import { Controller, Get } from '@nestjs/common';
import { Vehicle360Service } from './vehicle-360.service';

@Controller('avos/future/enterprise-products/vehicle-360')
export class Vehicle360Controller {
  constructor(private readonly service: Vehicle360Service) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}