import { Body, Controller, Get, Post } from '@nestjs/common';
import { AeosCertificationReport, AeosExecutionContext } from './contracts/aeos-mega-pack-2.contracts';
import { AeosMegaPack2OrchestratorService } from './aeos-mega-pack-2-orchestrator.service';

@Controller('avos/aeos/mega-pack-2')
export class AeosMegaPack2Controller {
  constructor(private readonly orchestrator: AeosMegaPack2OrchestratorService) {}

  @Get('status')
  status(): Record<string, unknown> {
    return this.orchestrator.status();
  }

  @Post('execute')
  execute(@Body() body: AeosExecutionContext): Record<string, unknown> {
    return this.orchestrator.execute(body);
  }

  @Post('verification/run')
  verify(): Record<string, unknown> {
    return this.orchestrator.verify();
  }

  @Get('production-readiness')
  readiness(): Record<string, unknown> {
    return this.orchestrator.readinessReport();
  }

  @Post('certification/certify')
  certify(@Body() body: { approvedBy: string }): AeosCertificationReport {
    return this.orchestrator.certify(body.approvedBy);
  }

  @Get('certification/status')
  certificationStatus(): AeosCertificationReport | Record<string, unknown> {
    return this.orchestrator.certificationStatus();
  }
}
