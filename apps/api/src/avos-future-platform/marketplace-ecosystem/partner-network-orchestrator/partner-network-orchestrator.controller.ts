import { Controller, Get } from '@nestjs/common';
import { PartnerNetworkOrchestratorService } from './partner-network-orchestrator.service';

@Controller('avos/future/marketplace-ecosystem/partner-network-orchestrator')
export class PartnerNetworkOrchestratorController {
  constructor(private readonly service: PartnerNetworkOrchestratorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}