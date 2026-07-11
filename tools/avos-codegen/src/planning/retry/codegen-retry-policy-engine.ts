import {
  CodeGenRetryPolicy,
} from "../scheduling/codegen-scheduling.contracts";

export class CodeGenRetryPolicyEngine {
  create(
    input:
      Partial<
        CodeGenRetryPolicy
      > = {},
  ): CodeGenRetryPolicy {
    return {
      maxAttempts:
        Math.max(
          1,
          input.maxAttempts ??
            1,
        ),
      backoffMs:
        Math.max(
          0,
          input.backoffMs ??
            0,
        ),
      backoffMultiplier:
        Math.max(
          1,
          input.backoffMultiplier ??
            2,
        ),
      retryableErrors:
        Array.from(
          new Set(
            input.retryableErrors ??
              [],
          ),
        ),
    };
  }

  delayForAttempt(
    policy:
      CodeGenRetryPolicy,
    attempt: number,
  ): number {
    if (attempt <= 1) {
      return 0;
    }

    return Math.round(
      policy.backoffMs *
      Math.pow(
        policy.backoffMultiplier,
        attempt - 2,
      ),
    );
  }

  shouldRetry(
    policy:
      CodeGenRetryPolicy,
    attempt: number,
    errorMessage: string,
  ): boolean {
    if (
      attempt >=
      policy.maxAttempts
    ) {
      return false;
    }

    if (
      policy.retryableErrors.length ===
      0
    ) {
      return true;
    }

    return policy.retryableErrors
      .some(
        (value) =>
          errorMessage.includes(
            value,
          ),
      );
  }
}
