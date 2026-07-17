import { Controller, Get } from '@nestjs/common';
import { StrategicPlanningEngineService } from './strategic-planning-engine.service';

@Controller('avos/future/autonomous-enterprise/strategic-planning-engine')
export class StrategicPlanningEngineController {
  constructor(private readonly service: StrategicPlanningEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}