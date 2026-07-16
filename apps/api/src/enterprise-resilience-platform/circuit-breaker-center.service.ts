import { Injectable } from "@nestjs/common";
import type { CircuitBreakerRecord } from "./enterprise-resilience.types";

@Injectable()
export class CircuitBreakerCenterService {
  private readonly breakers = new Map<string, CircuitBreakerRecord>();

  configure(
    key: string,
    threshold = 5,
    resetAfterMs = 30000,
  ): CircuitBreakerRecord {
    const existing = this.breakers.get(key);

    const breaker: CircuitBreakerRecord = existing ?? {
      key,
      state: "CLOSED",
      failures: 0,
      successes: 0,
      threshold,
      resetAfterMs,
      updatedAt: new Date().toISOString(),
    };

    breaker.threshold = threshold;
    breaker.resetAfterMs = resetAfterMs;
    breaker.updatedAt = new Date().toISOString();

    this.breakers.set(key, breaker);
    return { ...breaker };
  }

  canExecute(key: string): boolean {
    const breaker = this.ensure(key);

    if (breaker.state === "OPEN") {
      const openedAt = breaker.openedAt
        ? new Date(breaker.openedAt).getTime()
        : Date.now();

      if (Date.now() - openedAt >= breaker.resetAfterMs) {
        breaker.state = "HALF_OPEN";
        breaker.updatedAt = new Date().toISOString();
        return true;
      }

      return false;
    }

    return true;
  }

  success(key: string): CircuitBreakerRecord {
    const breaker = this.ensure(key);
    breaker.successes += 1;
    breaker.failures = 0;
    breaker.state = "CLOSED";
    breaker.openedAt = undefined;
    breaker.updatedAt = new Date().toISOString();
    return { ...breaker };
  }

  failure(key: string): CircuitBreakerRecord {
    const breaker = this.ensure(key);
    breaker.failures += 1;

    if (breaker.failures >= breaker.threshold) {
      breaker.state = "OPEN";
      breaker.openedAt = new Date().toISOString();
    }

    breaker.updatedAt = new Date().toISOString();
    return { ...breaker };
  }

  list(): CircuitBreakerRecord[] {
    return Array.from(this.breakers.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.breakers.size;
  }

  openCount(): number {
    return this.list().filter((item) => item.state === "OPEN").length;
  }

  private ensure(key: string): CircuitBreakerRecord {
    return this.breakers.get(key) ?? this.configure(key);
  }
}
