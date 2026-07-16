import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BulkheadIsolationService } from "./bulkhead-isolation.service";
import { ChaosEngineeringService } from "./chaos-engineering.service";
import { CircuitBreakerCenterService } from "./circuit-breaker-center.service";
import { EnterpriseResiliencePlatformService } from "./enterprise-resilience-platform.service";
import { FailoverRouterService } from "./failover-router.service";
import { RateLimiterService } from "./rate-limiter.service";
import { RetryFrameworkService } from "./retry-framework.service";
import { SloSliEngineService } from "./slo-sli-engine.service";
import { TimeoutManagerService } from "./timeout-manager.service";
import type {
  ChaosExperimentRecord,
  FailoverTargetRecord,
  RetryPolicyRecord,
  SloDefinitionRecord,
  TimeoutPolicyRecord,
} from "./enterprise-resilience.types";

@Controller("enterprise-resilience-platform")
export class EnterpriseResiliencePlatformController {
  constructor(
    private readonly platform: EnterpriseResiliencePlatformService,
    private readonly circuits: CircuitBreakerCenterService,
    private readonly retries: RetryFrameworkService,
    private readonly timeouts: TimeoutManagerService,
    private readonly rateLimits: RateLimiterService,
    private readonly bulkheads: BulkheadIsolationService,
    private readonly failover: FailoverRouterService,
    private readonly chaos: ChaosEngineeringService,
    private readonly slo: SloSliEngineService,
  ) {}

  @Get("status")
  status() {
    return this.platform.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("circuit-breakers/:key")
  configureCircuit(
    @Param("key") key: string,
    @Body() body: { threshold?: number; resetAfterMs?: number },
  ) {
    return {
      success: true,
      circuitBreaker: this.circuits.configure(
        key,
        body.threshold,
        body.resetAfterMs,
      ),
    };
  }

  @Post("retry-policies")
  registerRetryPolicy(@Body() body: RetryPolicyRecord) {
    return {
      success: true,
      policy: this.retries.register(body),
    };
  }

  @Post("timeout-policies")
  registerTimeoutPolicy(@Body() body: TimeoutPolicyRecord) {
    return {
      success: true,
      policy: this.timeouts.register(body),
    };
  }

  @Post("rate-limits/:key")
  configureRateLimit(
    @Param("key") key: string,
    @Body() body: { limit: number; windowMs: number },
  ) {
    return {
      success: true,
      rateLimit: this.rateLimits.configure(
        key,
        body.limit,
        body.windowMs,
      ),
    };
  }

  @Post("bulkheads/:key")
  configureBulkhead(
    @Param("key") key: string,
    @Body() body: { maxConcurrency: number },
  ) {
    return {
      success: true,
      bulkhead: this.bulkheads.configure(
        key,
        body.maxConcurrency,
      ),
    };
  }

  @Post("failover-targets")
  registerFailoverTarget(@Body() body: FailoverTargetRecord) {
    return {
      success: true,
      target: this.failover.register(body),
    };
  }

  @Post("chaos-experiments")
  registerChaosExperiment(
    @Body()
    body: Omit<ChaosExperimentRecord, "id" | "createdAt"> & { id?: string },
  ) {
    return {
      success: true,
      experiment: this.chaos.register(body),
    };
  }

  @Post("slos")
  registerSlo(@Body() body: SloDefinitionRecord) {
    return {
      success: true,
      slo: this.slo.register(body),
    };
  }

  @Post("slos/:id/measure")
  measureSli(
    @Param("id") id: string,
    @Body()
    body: {
      availability: number;
      latencyMs: number;
      errorRate: number;
    },
  ) {
    return {
      success: true,
      measurement: this.slo.measure(
        id,
        body.availability,
        body.latencyMs,
        body.errorRate,
      ),
    };
  }
}
