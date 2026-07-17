import { Controller, Get } from '@nestjs/common';
import { MobilityScenarioSimulatorService } from './mobility-scenario-simulator.service';

@Controller('avos/future/mobility-industry/mobility-scenario-simulator')
export class MobilityScenarioSimulatorController {
  constructor(private readonly service: MobilityScenarioSimulatorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}