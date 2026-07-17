import { Controller, Get } from '@nestjs/common';
import { MarketExpansionAiService } from './market-expansion-ai.service';

@Controller('avos/future/growth-commerce/market-expansion-ai')
export class MarketExpansionAiController {
  constructor(private readonly service: MarketExpansionAiService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}