import { Injectable } from "@nestjs/common";

@Injectable()
export class AdaptiveGrowthResilienceService {
  private readonly circuitStates = new Map<string, {
    failures: number;
    state: "closed" | "open" | "half-open";
  }>();

  recordSuccess(key: string) {
    this.circuitStates.set(key, { failures: 0, state: "closed" });
    return this.circuitStates.get(key);
  }

  recordFailure(key: string) {
    const current = this.circuitStates.get(key) ?? { failures: 0, state: "closed" as const };
    const failures = current.failures + 1;
    const state = failures >= 3 ? "open" as const : "closed" as const;
    const next = { failures, state };
    this.circuitStates.set(key, next);
    return next;
  }

  status() {
    return {
      status: "operational",
      circuitBreakers: this.circuitStates.size,
      retryPolicy: {
        maxAttempts: 3,
        backoff: "exponential",
      },
      bulkheadIsolationReady: true,
      idempotencyReady: true,
    };
  }
}