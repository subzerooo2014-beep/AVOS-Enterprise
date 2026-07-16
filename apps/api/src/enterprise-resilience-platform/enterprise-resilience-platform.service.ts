import { Injectable } from "@nestjs/common";
import { BulkheadIsolationService } from "./bulkhead-isolation.service";
import { ChaosEngineeringService } from "./chaos-engineering.service";
import { CircuitBreakerCenterService } from "./circuit-breaker-center.service";
import { FailoverRouterService } from "./failover-router.service";
import { RateLimiterService } from "./rate-limiter.service";
import { RetryFrameworkService } from "./retry-framework.service";
import { SloSliEngineService } from "./slo-sli-engine.service";
import { TimeoutManagerService } from "./timeout-manager.service";
import type {
  ResilienceHealth,
  ResilienceMetrics,
} from "./enterprise-resilience.types";

@Injectable()
export class EnterpriseResiliencePlatformService {
  constructor(
    private readonly circuits: CircuitBreakerCenterService,
    private readonly retries: RetryFrameworkService,
    private readonly timeouts: TimeoutManagerService,
    private readonly rateLimits: RateLimiterService,
    private readonly bulkheads: BulkheadIsolationService,
    private readonly failover: FailoverRouterService,
    private readonly chaos: ChaosEngineeringService,
    private readonly slo: SloSliEngineService,
  ) {}

  metrics(): ResilienceMetrics {
    return {
      circuitBreakers: this.circuits.count(),
      openCircuits: this.circuits.openCount(),
      retryPolicies: this.retries.count(),
      timeoutPolicies: this.timeouts.count(),
      rateLimits: this.rateLimits.count(),
      bulkheads: this.bulkheads.count(),
      failoverTargets: this.failover.count(),
      chaosExperiments: this.chaos.count(),
      slos: this.slo.definitionCount(),
      sliMeasurements: this.slo.measurementsList().length,
      sloViolations: this.slo.violationCount(),
    };
  }

  health(): ResilienceHealth {
    const metrics = this.metrics();
    const degraded =
      metrics.openCircuits > 0 ||
      metrics.sloViolations > 0;

    return {
      success: true,
      system: "AVOS Enterprise Resilience Platform",
      version: "1.0.0",
      status: degraded ? "DEGRADED" : "READY",
      metrics,
      components: {
        circuitBreakerCenter: "READY",
        retryFramework: "READY",
        timeoutManager: "READY",
        rateLimiter: "READY",
        bulkheadIsolation: "READY",
        failoverRouter: "READY",
        adaptiveRecovery: "READY",
        chaosEngineering: "READY",
        sloSliEngine: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      circuitBreakers: this.circuits.list(),
      retryPolicies: this.retries.list(),
      timeoutPolicies: this.timeouts.list(),
      rateLimits: this.rateLimits.list(),
      bulkheads: this.bulkheads.list(),
      failoverTargets: this.failover.list(),
      chaosExperiments: this.chaos.list(),
      slos: this.slo.definitionsList(),
      sliMeasurements: this.slo.measurementsList(),
    };
  }
}
