import { Module } from "@nestjs/common";
import { EnterpriseOrchestrationController } from "./enterprise-orchestration.controller";
import { EnterpriseOrchestrationService } from "./enterprise-orchestration.service";
import { SagaCoordinator } from "./engines/saga-coordinator";
import { CompensationEngine } from "./engines/compensation-engine";
import { RetryOrchestrator } from "./engines/retry-orchestrator";
import { EventDispatcher } from "./engines/event-dispatcher";

@Module({
  controllers: [EnterpriseOrchestrationController],
  providers: [
    EnterpriseOrchestrationService,
    SagaCoordinator,
    CompensationEngine,
    RetryOrchestrator,
    EventDispatcher,
  ],
  exports: [
    EnterpriseOrchestrationService,
    SagaCoordinator,
    CompensationEngine,
    RetryOrchestrator,
    EventDispatcher,
  ],
})
export class EnterpriseOrchestrationModule {}
