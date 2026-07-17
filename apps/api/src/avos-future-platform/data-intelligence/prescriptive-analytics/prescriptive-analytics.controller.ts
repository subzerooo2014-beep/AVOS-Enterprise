import { Controller, Get } from '@nestjs/common';
import { PrescriptiveAnalyticsService } from './prescriptive-analytics.service';

@Controller('avos/future/data-intelligence/prescriptive-analytics')
export class PrescriptiveAnalyticsController {
  constructor(private readonly service: PrescriptiveAnalyticsService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}