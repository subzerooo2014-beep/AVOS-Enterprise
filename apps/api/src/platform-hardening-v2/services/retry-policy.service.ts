import { Injectable, Logger } from "@nestjs/common";
import { RetryOptions } from "../interfaces/retry-options.interface";

@Injectable()
export class RetryPolicyService {
  private readonly logger = new Logger(RetryPolicyService.name);

  async execute<T>(
    operationName: string,
    operation: (attempt: number) => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const attempts = this.normalizeInteger(options.attempts, 3, 1, 10);
    const initialDelayMs = this.normalizeInteger(
      options.initialDelayMs,
      100,
      0,
      60_000,
    );
    const maximumDelayMs = this.normalizeInteger(
      options.maximumDelayMs,
      5_000,
      0,
      300_000,
    );
    const backoffMultiplier =
      typeof options.backoffMultiplier === "number" &&
      options.backoffMultiplier >= 1
        ? options.backoffMultiplier
        : 2;

    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return await operation(attempt);
      } catch (error) {
        lastError = error;

        const canRetry =
          attempt < attempts &&
          (options.shouldRetry
            ? options.shouldRetry(error, attempt)
            : true);

        if (!canRetry) {
          throw error;
        }

        const calculatedDelay =
          initialDelayMs * Math.pow(backoffMultiplier, attempt - 1);

        const delayMs = Math.min(calculatedDelay, maximumDelayMs);

        this.logger.warn(
          `${operationName} failed on attempt ${attempt}/${attempts}. ` +
          `Retrying in ${delayMs}ms.`,
        );

        await this.delay(delayMs);
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error(`${operationName} failed after ${attempts} attempts`);
  }

  private delay(milliseconds: number): Promise<void> {
    if (milliseconds <= 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const timer = setTimeout(resolve, milliseconds);
      timer.unref?.();
    });
  }

  private normalizeInteger(
    value: number | undefined,
    fallback: number,
    minimum: number,
    maximum: number,
  ): number {
    if (!Number.isFinite(value)) {
      return fallback;
    }

    return Math.min(
      maximum,
      Math.max(minimum, Math.floor(value as number)),
    );
  }
}
