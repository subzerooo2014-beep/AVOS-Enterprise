import { Body, Controller, Get, Post } from '@nestjs/common';
import { SoftwareDevelopmentOsUltimateOrchestratorService } from './software-development-os-ultimate-orchestrator.service';

@Controller('avos/software-development-os/ultimate')
export class SoftwareDevelopmentOsUltimateController {
  constructor(
    private readonly orchestrator: SoftwareDevelopmentOsUltimateOrchestratorService,
  ) {}

  @Get('status')
  status() {
    return this.orchestrator.getStatus();
  }

  @Get('review')
  review() {
    return this.orchestrator.review();
  }

  @Get('evolution-plan')
  evolutionPlan() {
    return this.orchestrator.getEvolutionPlan();
  }

  @Post('certify')
  certify(@Body() body?: { approvedBy?: string }) {
    return this.orchestrator.certify(body?.approvedBy);
  }

  @Get('certification')
  certification() {
    return this.orchestrator.getCertification();
  }
}
