import { Injectable } from "@nestjs/common";

@Injectable()
export class RetryPolicyEngineService {
  evaluate(input: {
    attempts: number;
    maxAttempts: number;
    severity: number;
  }) {
    const retryAllowed =
      input.attempts < input.maxAttempts &&
      input.severity < 90;

    return {
      retryAllowed,
      nextDelayMs: retryAllowed
        ? Math.min(30000, 1000 * Math.pow(2, input.attempts))
        : 0,
    };
  }
}
