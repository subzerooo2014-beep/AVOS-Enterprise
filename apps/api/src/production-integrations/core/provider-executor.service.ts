import { Injectable } from "@nestjs/common";
import { ProviderKind, ProviderExecutionResult } from "../production-integrations.types";
import { ExecutionContextService } from "./execution-context.service";
import { FailoverRouterService } from "../reliability/failover-router.service";
import { CircuitBreakerService } from "../reliability/circuit-breaker.service";
import { RateLimiterService } from "../reliability/rate-limiter.service";
import { TimeoutPolicyService } from "../reliability/timeout-policy.service";
import { ProviderMetricsService } from "../monitoring/provider-metrics.service";

@Injectable()
export class ProviderExecutorService {
  constructor(
    private readonly context: ExecutionContextService,
    private readonly router: FailoverRouterService,
    private readonly breaker: CircuitBreakerService,
    private readonly limiter: RateLimiterService,
    private readonly timeout: TimeoutPolicyService,
    private readonly metrics: ProviderMetricsService,
  ) {}

  execute(kind: ProviderKind, operation: string, payload: Record<string, unknown>): ProviderExecutionResult {
    const provider = this.router.select(kind);
    if (!this.limiter.allow(provider.code)) throw new Error("Rate limit exceeded");
    const ctx = this.context.create();
    const started = Date.now();
    try {
      const data = this.timeout.execute(() => ({
        operation,
        payload,
        correlationId: ctx.correlationId,
        idempotencyKey: ctx.idempotencyKey,
        simulated: true,
      }), provider.timeoutMs);
      const latencyMs = Date.now() - started;
      this.breaker.success(provider.code);
      this.metrics.record(provider.code, true, latencyMs);
      return { success: true, providerCode: provider.code, latencyMs, status: "ACCEPTED", data };
    } catch (error) {
      const latencyMs = Date.now() - started;
      this.breaker.failure(provider.code);
      this.metrics.record(provider.code, false, latencyMs);
      throw error;
    }
  }
}
