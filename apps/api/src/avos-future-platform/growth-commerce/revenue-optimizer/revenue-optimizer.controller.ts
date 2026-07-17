import { Controller, Get } from '@nestjs/common';
import { RevenueOptimizerService } from './revenue-optimizer.service';

@Controller('avos/future/growth-commerce/revenue-optimizer')
export class RevenueOptimizerController {
  constructor(private readonly service: RevenueOptimizerService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}