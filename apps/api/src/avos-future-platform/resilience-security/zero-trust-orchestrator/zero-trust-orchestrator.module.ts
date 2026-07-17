import { Module } from '@nestjs/common';
import { ZeroTrustOrchestratorController } from './zero-trust-orchestrator.controller';
import { ZeroTrustOrchestratorService } from './zero-trust-orchestrator.service';

@Module({
  controllers: [ZeroTrustOrchestratorController],
  providers: [ZeroTrustOrchestratorService],
  exports: [ZeroTrustOrchestratorService],
})
export class ZeroTrustOrchestratorModule {}