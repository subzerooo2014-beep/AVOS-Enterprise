import { Injectable } from "@nestjs/common";
import { EnterpriseCircuitSnapshot } from "./enterprise-e5.types";

@Injectable()
export class EnterpriseCircuitBreakerService {
  private failures = 0;
  private state: EnterpriseCircuitSnapshot["state"] = "CLOSED";
  private lastFailureAt?: string;
  private readonly threshold = 3;

  recordSuccess(): EnterpriseCircuitSnapshot {
    this.failures = 0;
    this.state = "CLOSED";
    return this.snapshot();
  }

  recordFailure(): EnterpriseCircuitSnapshot {
    this.failures += 1;
    this.lastFailureAt = new Date().toISOString();

    if (this.failures >= this.threshold) {
      this.state = "OPEN";
    }

    return this.snapshot();
  }

  halfOpen(): EnterpriseCircuitSnapshot {
    this.state = "HALF_OPEN";
    return this.snapshot();
  }

  snapshot(): EnterpriseCircuitSnapshot {
    return {
      state: this.state,
      failures: this.failures,
      threshold: this.threshold,
      lastFailureAt: this.lastFailureAt,
    };
  }
}