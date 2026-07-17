import { Controller, Get } from '@nestjs/common';
import { DecisionIntelligenceEngineService } from './decision-intelligence-engine.service';

@Controller('avos/future/autonomous-enterprise/decision-intelligence-engine')
export class DecisionIntelligenceEngineController {
  constructor(private readonly service: DecisionIntelligenceEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}