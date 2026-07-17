import { Controller, Get } from '@nestjs/common';
import { IncidentLearningEngineService } from './incident-learning-engine.service';

@Controller('avos/future/resilience-security/incident-learning-engine')
export class IncidentLearningEngineController {
  constructor(private readonly service: IncidentLearningEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}