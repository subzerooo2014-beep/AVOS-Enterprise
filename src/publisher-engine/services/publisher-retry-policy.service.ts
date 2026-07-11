import { Injectable } from "@nestjs/common";

export interface PublisherRetryDecision {
  retry: boolean;
  attempt: number;
  maxAttempts: number;
  delayMs: number;
  reason: string;
}

@Injectable()
export class PublisherRetryPolicyService {
  private readonly defaultMaxAttempts = this.readPositiveInteger(
    process.env.PUBLISHER_MAX_ATTEMPTS,
    3,
  );

  private readonly initialDelayMs = this.readNonNegativeInteger(
    process.env.PUBLISHER_RETRY_DELAY_MS,
    1_000,
  );

  private readonly maximumDelayMs = this.readPositiveInteger(
    process.env.PUBLISHER_MAX_RETRY_DELAY_MS,
    30_000,
  );

  private readonly multiplier = this.readPositiveNumber(
    process.env.PUBLISHER_RETRY_MULTIPLIER,
    2,
  );

  maxAttempts(job?: any): number {
    const configured =
      this.toPositiveInteger(job?.maxAttempts) ??
      this.toPositiveInteger(job?.result?.maxAttempts) ??
      this.toPositiveInteger(job?.metadata?.maxAttempts);

    return configured ?? this.defaultMaxAttempts;
  }

  currentAttempt(job?: any): number {
    const attempt =
      this.toNonNegativeInteger(job?.retryCount) ??
      this.toNonNegativeInteger(job?.attempt) ??
      0;

    return attempt + 1;
  }

  decide(
    job: any,
    attempt: number,
    error?: unknown,
    status?: string,
  ): PublisherRetryDecision {
    const maxAttempts = this.maxAttempts(job);
    const normalizedStatus = String(status ?? "").toLowerCase();

    if (
      normalizedStatus === "published" ||
      normalizedStatus === "skipped"
    ) {
      return {
        retry: false,
        attempt,
        maxAttempts,
        delayMs: 0,
        reason: `Terminal success status: ${normalizedStatus}`,
      };
    }

    if (attempt >= maxAttempts) {
      return {
        retry: false,
        attempt,
        maxAttempts,
        delayMs: 0,
        reason: "Maximum publisher attempts reached",
      };
    }

    if (!this.isRetryable(error, normalizedStatus)) {
      return {
        retry: false,
        attempt,
        maxAttempts,
        delayMs: 0,
        reason: "Publisher failure is classified as non-retryable",
      };
    }

    return {
      retry: true,
      attempt,
      maxAttempts,
      delayMs: this.calculateDelay(attempt),
      reason: "Publisher failure is retryable",
    };
  }

  private isRetryable(
    error: unknown,
    status: string,
  ): boolean {
    if (status === "retrying") {
      return true;
    }

    if (status === "dead") {
      return false;
    }

    const message = this.errorMessage(error).toLowerCase();

    const nonRetryablePatterns = [
      "validation",
      "invalid payload",
      "unauthorized",
      "forbidden",
      "not registered",
      "not found",
      "unsupported",
      "duplicate",
      "already published",
    ];

    if (
      nonRetryablePatterns.some((pattern) =>
        message.includes(pattern),
      )
    ) {
      return false;
    }

    const retryablePatterns = [
      "timeout",
      "timed out",
      "temporarily unavailable",
      "connection",
      "network",
      "socket",
      "rate limit",
      "too many requests",
      "service unavailable",
      "gateway",
      "econnreset",
      "econnrefused",
      "429",
      "502",
      "503",
      "504",
    ];

    if (
      retryablePatterns.some((pattern) =>
        message.includes(pattern),
      )
    ) {
      return true;
    }

    return status === "failed" || status === "unknown";
  }

  private calculateDelay(attempt: number): number {
    if (this.initialDelayMs === 0) {
      return 0;
    }

    const exponential =
      this.initialDelayMs *
      Math.pow(this.multiplier, Math.max(attempt - 1, 0));

    const capped = Math.min(
      exponential,
      this.maximumDelayMs,
    );

    const jitterMultiplier = 0.8 + Math.random() * 0.4;

    return Math.max(
      0,
      Math.round(capped * jitterMultiplier),
    );
  }

  private readPositiveInteger(
    value: string | undefined,
    fallback: number,
  ): number {
    return this.toPositiveInteger(value) ?? fallback;
  }

  private readNonNegativeInteger(
    value: string | undefined,
    fallback: number,
  ): number {
    return this.toNonNegativeInteger(value) ?? fallback;
  }

  private readPositiveNumber(
    value: string | undefined,
    fallback: number,
  ): number {
    const numeric = Number(value);

    return Number.isFinite(numeric) && numeric > 0
      ? numeric
      : fallback;
  }

  private toPositiveInteger(
    value: unknown,
  ): number | undefined {
    const numeric = Number(value);

    return Number.isInteger(numeric) && numeric > 0
      ? numeric
      : undefined;
  }

  private toNonNegativeInteger(
    value: unknown,
  ): number | undefined {
    const numeric = Number(value);

    return Number.isInteger(numeric) && numeric >= 0
      ? numeric
      : undefined;
  }

  private errorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error ?? "");
  }
}
