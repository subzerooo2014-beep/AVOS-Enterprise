import { Module } from "@nestjs/common";
import { PersistentEventLedgerService } from "./persistent-event-ledger.service";
import { RetryPolicyEngineService } from "./retry-policy-engine.service";
import { ReplayGovernanceService } from "./replay-governance.service";
import { DeadLetterQueueService } from "./dead-letter-queue.service";
import { EventIdempotencyService } from "./event-idempotency.service";
import { EventCorrelationService } from "./event-correlation.service";
import { EventSlaMonitorService } from "./event-sla-monitor.service";
import { EventHealthScoreService } from "./event-health-score.service";
import { EventRoutingIntelligenceService } from "./event-routing-intelligence.service";
import { EventEvidenceChainService } from "./event-evidence-chain.service";
import { EventRecoveryOrchestratorService } from "./event-recovery-orchestrator.service";
import { EventOperationsController } from "./event-operations-controller";

@Module({
  controllers: [EventOperationsController],
  providers: [
    PersistentEventLedgerService,
    RetryPolicyEngineService,
    ReplayGovernanceService,
    DeadLetterQueueService,
    EventIdempotencyService,
    EventCorrelationService,
    EventSlaMonitorService,
    EventHealthScoreService,
    EventRoutingIntelligenceService,
    EventEvidenceChainService,
    EventRecoveryOrchestratorService,
  ],
  exports: [
    PersistentEventLedgerService,
    RetryPolicyEngineService,
    ReplayGovernanceService,
    DeadLetterQueueService,
    EventIdempotencyService,
    EventCorrelationService,
    EventSlaMonitorService,
    EventHealthScoreService,
    EventRoutingIntelligenceService,
    EventEvidenceChainService,
    EventRecoveryOrchestratorService,
  ],
})
export class VehicleEventOperationsModule {}
