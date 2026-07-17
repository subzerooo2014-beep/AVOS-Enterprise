import { Controller, Get } from '@nestjs/common';
import { CompetitorIntelligenceService } from './competitor-intelligence.service';

@Controller('avos/future/growth-commerce/competitor-intelligence')
export class CompetitorIntelligenceController {
  constructor(private readonly service: CompetitorIntelligenceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}