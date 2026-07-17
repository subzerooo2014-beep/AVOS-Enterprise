import { Controller, Get } from '@nestjs/common';
import { PredictiveAnalyticsService } from './predictive-analytics.service';

@Controller('avos/future/data-intelligence/predictive-analytics')
export class PredictiveAnalyticsController {
  constructor(private readonly service: PredictiveAnalyticsService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}