import { Controller, Get } from '@nestjs/common';
import { RealTimeInsightEngineService } from './real-time-insight-engine.service';

@Controller('avos/future/data-intelligence/real-time-insight-engine')
export class RealTimeInsightEngineController {
  constructor(private readonly service: RealTimeInsightEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}