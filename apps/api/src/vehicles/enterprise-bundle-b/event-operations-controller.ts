import { Body, Controller, Get, Post } from "@nestjs/common";
import { PersistentEventLedgerService } from "./persistent-event-ledger.service";
import { RetryPolicyEngineService } from "./retry-policy-engine.service";
import { ReplayGovernanceService } from "./replay-governance.service";
import { DeadLetterQueueService } from "./dead-letter-queue.service";
import { EventIdempotencyService } from "./event-idempotency.service";
import { EventHealthScoreService } from "./event-health-score.service";
import { EventRecoveryOrchestratorService } from "./event-recovery-orchestrator.service";

@Controller("vehicle-event-operations")
export class EventOperationsController {
  constructor(
    private readonly ledger: PersistentEventLedgerService,
    private readonly retryPolicy: RetryPolicyEngineService,
    private readonly replayGovernance: ReplayGovernanceService,
    private readonly deadLetterQueue: DeadLetterQueueService,
    private readonly idempotency: EventIdempotencyService,
    private readonly health: EventHealthScoreService,
    private readonly recovery: EventRecoveryOrchestratorService,
  ) {}

  @Post("ledger")
  append(@Body() body: Record<string, unknown>) {
    return {
      success: true,
      record: this.ledger.append(body),
    };
  }

  @Post("idempotency")
  claim(@Body() body: { key: string }) {
    return {
      success: true,
      ...this.idempotency.claim(body.key),
    };
  }

  @Post("retry-policy")
  retry(@Body() body: {
    attempts: number;
    maxAttempts: number;
    severity: number;
  }) {
    return {
      success: true,
      ...this.retryPolicy.evaluate(body),
    };
  }

  @Post("replay-governance")
  replay(@Body() body: {
    integrityScore: number;
    replayCount: number;
    maxReplayCount: number;
  }) {
    return {
      success: true,
      ...this.replayGovernance.authorize(body),
    };
  }

  @Post("recovery")
  recover(@Body() body: {
    eventId: string;
    attempts: number;
    maxAttempts: number;
    severity: number;
    error: string;
  }) {
    return {
      success: true,
      ...this.recovery.recover(body),
    };
  }

  @Post("health")
  healthScore(@Body() body: {
    successRate: number;
    retryRate: number;
    latencyScore: number;
    auditScore: number;
  }) {
    return {
      success: true,
      ...this.health.calculate(body),
    };
  }

  @Get("ledger")
  listLedger() {
    return {
      success: true,
      records: this.ledger.list(),
    };
  }

  @Get("dead-letter")
  listDeadLetter() {
    return {
      success: true,
      records: this.deadLetterQueue.list(),
    };
  }

  @Get("status")
  status() {
    return {
      success: true,
      system: "AVOS Vehicle Event Operations",
      status: "running",
      ledgerEntries: this.ledger.list().length,
      deadLetterEntries: this.deadLetterQueue.list().length,
      capabilities: 13,
    };
  }
}
