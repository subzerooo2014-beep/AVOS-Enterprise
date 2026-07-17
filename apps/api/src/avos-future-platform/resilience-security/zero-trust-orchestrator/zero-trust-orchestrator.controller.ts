import { Controller, Get } from '@nestjs/common';
import { ZeroTrustOrchestratorService } from './zero-trust-orchestrator.service';

@Controller('avos/future/resilience-security/zero-trust-orchestrator')
export class ZeroTrustOrchestratorController {
  constructor(private readonly service: ZeroTrustOrchestratorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}