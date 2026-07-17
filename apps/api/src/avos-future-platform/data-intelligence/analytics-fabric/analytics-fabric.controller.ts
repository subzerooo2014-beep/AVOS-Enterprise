import { Controller, Get } from '@nestjs/common';
import { AnalyticsFabricService } from './analytics-fabric.service';

@Controller('avos/future/data-intelligence/analytics-fabric')
export class AnalyticsFabricController {
  constructor(private readonly service: AnalyticsFabricService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}