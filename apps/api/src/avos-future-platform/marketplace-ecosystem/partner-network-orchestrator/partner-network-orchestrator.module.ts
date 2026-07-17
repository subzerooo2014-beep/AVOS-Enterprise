import { Module } from '@nestjs/common';
import { PartnerNetworkOrchestratorController } from './partner-network-orchestrator.controller';
import { PartnerNetworkOrchestratorService } from './partner-network-orchestrator.service';

@Module({
  controllers: [PartnerNetworkOrchestratorController],
  providers: [PartnerNetworkOrchestratorService],
  exports: [PartnerNetworkOrchestratorService],
})
export class PartnerNetworkOrchestratorModule {}