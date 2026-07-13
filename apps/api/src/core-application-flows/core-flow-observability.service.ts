import { Injectable } from "@nestjs/common";
import { CoreFlowOutboxService } from "./core-flow-outbox.service";
import { CoreFlowAuditService } from "./core-flow-audit.service";
import { CoreFlowSagaService } from "./core-flow-saga.service";
import { CoreFlowRateLimitService } from "./core-flow-rate-limit.service";
import { CoreFlowCircuitBreakerService } from "./core-flow-circuit-breaker.service";

@Injectable()
export class CoreFlowObservabilityService {
  constructor(
    private readonly outbox: CoreFlowOutboxService,
    private readonly audit: CoreFlowAuditService,
    private readonly sagas: CoreFlowSagaService,
    private readonly rateLimits: CoreFlowRateLimitService,
    private readonly circuits: CoreFlowCircuitBreakerService,
  ) {}

  dashboard() {
    const queue = this.outbox.dashboard();
    const sagaList = this.sagas.findAll();
    return {
      queue,
      audit: this.audit.stats(),
      sagas: {
        total: sagaList.length,
        running: sagaList.filter((item) => item.status === "running").length,
        completed: sagaList.filter((item) => item.status === "completed").length,
        failed: sagaList.filter((item) => item.status === "failed").length,
        compensated: sagaList.filter((item) => item.status === "compensated").length,
      },
      rateLimits: this.rateLimits.stats(),
      circuits: this.circuits.dashboard(),
      alerts: [
        ...(queue.deadLettered > 0
          ? [{ severity: "critical", code: "DEAD_LETTER_QUEUE_NOT_EMPTY" }]
          : []),
        ...(queue.queued > 50
          ? [{ severity: "warning", code: "QUEUE_BACKLOG_HIGH" }]
          : []),
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  health() {
    const dashboard = this.dashboard();
    const unhealthy =
      dashboard.queue.deadLettered > 0 ||
      dashboard.circuits.some((circuit) => circuit.state === "open");

    return {
      healthy: !unhealthy,
      status: unhealthy ? "degraded" : "healthy",
      dashboard,
    };
  }
}
