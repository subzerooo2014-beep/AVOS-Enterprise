import { Controller, Get } from '@nestjs/common';
import { ResilienceSimulatorService } from './resilience-simulator.service';

@Controller('avos/future/resilience-security/resilience-simulator')
export class ResilienceSimulatorController {
  constructor(private readonly service: ResilienceSimulatorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}