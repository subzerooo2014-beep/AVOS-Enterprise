import { Controller, Get, Post } from '@nestjs/common';
import { Aeos12OrchestratorService } from './aeos-1.2-orchestrator.service';

@Controller('avos/aeos/strategy-decision-intelligence')
export class Aeos12Controller {
  constructor(private readonly orchestrator: Aeos12OrchestratorService) {}

  @Get('status')
  status() {
    return this.orchestrator.status();
  }

  @Post('verify')
  verify() {
    return this.orchestrator.verify();
  }

  @Post('certify')
  certify() {
    return this.orchestrator.certify();
  }

  @Get('dashboard')
  dashboard() {
    const state = this.orchestrator.status();
    return {
      title: state.name,
      version: state.version,
      status: state.status,
      score: state.score,
      megaPacks: state.megaPacks,
      governance: {
        foundationFirst: state.foundationFirst,
        capabilityFirst: state.capabilityFirst,
        blueprintDriven: state.blueprintDriven,
        humanFinalAuthority: state.humanFinalAuthority,
        globalComplianceReadinessGate: state.globalComplianceReadinessGate,
      },
      capturedAt: state.capturedAt,
    };
  }
}
