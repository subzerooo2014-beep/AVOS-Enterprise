import { Injectable } from "@nestjs/common";

@Injectable()
export class RetryRecoveryService {
  plan(unit: string, attempt = 1) {
    const boundedAttempt = Math.max(1, Math.min(attempt, 8));
    const delayMs = Math.min(30000, 500 * 2 ** (boundedAttempt - 1));

    return {
      unit,
      attempt: boundedAttempt,
      delayMs,
      strategy: boundedAttempt >= 5 ? "controlled-recovery" : "exponential-backoff",
      retryId: `aeos-retry:${unit}:${Date.now()}`,
    };
  }
}