import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseRecoveryPolicyService {
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
      action: retryAllowed ? "RETRY" : "ESCALATE",
      delayMs: retryAllowed
        ? Math.min(30000, 1000 * Math.pow(2, input.attempts))
        : 0,
    };
  }
}
