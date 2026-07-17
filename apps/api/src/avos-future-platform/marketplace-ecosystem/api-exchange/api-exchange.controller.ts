import { Controller, Get } from '@nestjs/common';
import { ApiExchangeService } from './api-exchange.service';

@Controller('avos/future/marketplace-ecosystem/api-exchange')
export class ApiExchangeController {
  constructor(private readonly service: ApiExchangeService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}