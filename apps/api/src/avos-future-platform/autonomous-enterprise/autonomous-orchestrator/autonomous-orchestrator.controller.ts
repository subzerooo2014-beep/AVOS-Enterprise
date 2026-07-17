import { Controller, Get } from '@nestjs/common';
import { AutonomousOrchestratorService } from './autonomous-orchestrator.service';

@Controller('avos/future/autonomous-enterprise/autonomous-orchestrator')
export class AutonomousOrchestratorController {
  constructor(private readonly service: AutonomousOrchestratorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}