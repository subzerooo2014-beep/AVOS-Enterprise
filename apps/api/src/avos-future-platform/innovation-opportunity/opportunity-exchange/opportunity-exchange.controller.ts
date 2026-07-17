import { Controller, Get } from '@nestjs/common';
import { OpportunityExchangeService } from './opportunity-exchange.service';

@Controller('avos/future/innovation-opportunity/opportunity-exchange')
export class OpportunityExchangeController {
  constructor(private readonly service: OpportunityExchangeService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}