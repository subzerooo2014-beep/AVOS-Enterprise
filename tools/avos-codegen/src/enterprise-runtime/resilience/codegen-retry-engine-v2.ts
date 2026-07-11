import {
  CodeGenRetryAttempt,
  CodeGenRetryExecutionResult,
  CodeGenRetryPolicyV2,
} from "./codegen-retry-v2.contracts";

export class CodeGenRetryEngineV2 {
  normalize(
    input:
      Partial<
        CodeGenRetryPolicyV2
      > = {},
  ): CodeGenRetryPolicyV2 {
    return {
      maximumAttempts:
        Math.max(
          1,
          input.maximumAttempts ??
          3,
        ),
      initialDelayMs:
        Math.max(
          0,
          input.initialDelayMs ??
          100,
        ),
      maximumDelayMs:
        Math.max(
          0,
          input.maximumDelayMs ??
          5000,
        ),
      multiplier:
        Math.max(
          1,
          input.multiplier ??
          2,
        ),
      retryableErrorPatterns:
        [...(
          input.retryableErrorPatterns ??
          []
        )],
    };
  }

  async execute<T>(
    operation:
      (attempt: number) =>
        Promise<T>,
    policyInput:
      Partial<
        CodeGenRetryPolicyV2
      > = {},
  ): Promise<
    CodeGenRetryExecutionResult<T>
  > {
    const policy =
      this.normalize(
        policyInput,
      );

    const attempts:
      CodeGenRetryAttempt[] =
      [];

    let lastError:
      string | undefined;

    for (
      let attempt = 1;
      attempt <=
        policy.maximumAttempts;
      attempt += 1
    ) {
      const startedAt =
        new Date().toISOString();

      try {
        const value =
          await operation(
            attempt,
          );

        return {
          success: true,
          value,
          attempts,
          completedAt:
            new Date().toISOString(),
        };
      } catch (error) {
        const completedAt =
          new Date().toISOString();

        lastError =
          error instanceof Error
            ? error.message
            : String(error);

        const delayMs =
          this.delayForAttempt(
            policy,
            attempt,
          );

        attempts.push({
          attempt,
          delayMs,
          error:
            lastError,
          startedAt,
          completedAt,
        });

        if (
          attempt >=
            policy.maximumAttempts ||
          !this.shouldRetry(
            lastError,
            policy,
          )
        ) {
          break;
        }

        if (delayMs > 0) {
          await new Promise<void>(
            (resolve) => {
              setTimeout(
                resolve,
                delayMs,
              );
            },
          );
        }
      }
    }

    return {
      success: false,
      attempts,
      ...(lastError
        ? {
            error:
              lastError,
          }
        : {}),
      completedAt:
        new Date().toISOString(),
    };
  }

  delayForAttempt(
    policy:
      CodeGenRetryPolicyV2,
    attempt: number,
  ): number {
    if (attempt <= 0) {
      return 0;
    }

    return Math.min(
      policy.maximumDelayMs,
      Math.round(
        policy.initialDelayMs *
        Math.pow(
          policy.multiplier,
          Math.max(
            0,
            attempt - 1,
          ),
        ),
      ),
    );
  }

  shouldRetry(
    errorMessage: string,
    policy:
      CodeGenRetryPolicyV2,
  ): boolean {
    if (
      policy
        .retryableErrorPatterns
        .length === 0
    ) {
      return true;
    }

    return policy
      .retryableErrorPatterns
      .some(
        (pattern) =>
          errorMessage.includes(
            pattern,
          ),
      );
  }
}
