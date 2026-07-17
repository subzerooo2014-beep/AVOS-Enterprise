import { Controller, Get } from '@nestjs/common';
import { ScenarioSimulationEngineService } from './scenario-simulation-engine.service';

@Controller('avos/future/autonomous-enterprise/scenario-simulation-engine')
export class ScenarioSimulationEngineController {
  constructor(private readonly service: ScenarioSimulationEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}