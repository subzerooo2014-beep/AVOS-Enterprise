import { Controller, Get } from '@nestjs/common';
import { PricingIntelligenceService } from './pricing-intelligence.service';

@Controller('avos/future/mobility-industry/pricing-intelligence')
export class PricingIntelligenceController {
  constructor(private readonly service: PricingIntelligenceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}