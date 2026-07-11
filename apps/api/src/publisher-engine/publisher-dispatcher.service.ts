import {
  Injectable,
  Logger,
  OnApplicationShutdown,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { randomUUID } from "node:crypto";

import { PrismaService } from "../prisma/prisma.service";
import { AiActionLogService } from "../ai-action-log/ai-action-log.service";
import { PublisherRegistryService } from "./publisher-registry.service";
import { PublisherDispatchCoreService } from "./services/publisher-dispatch-core.service";
import { PublisherRetryPolicyService } from "./services/publisher-retry-policy.service";
import { PublisherCircuitBreakerService } from "./services/publisher-circuit-breaker.service";
import { PublisherRuntimeMetricsService } from "./services/publisher-runtime-metrics.service";
import { PublisherDeadLetterService } from "./services/publisher-dead-letter.service";
import { PublisherJobReservationService } from "./services/publisher-job-reservation.service";

export interface PublisherDispatcherHealth {
  success: boolean;
  version: "v2";
  engine: "PublisherEngineV2";
  workerId: string;
  acceptingJobs: boolean;

  workerPool: {
    concurrency: number;
    activeWorkers: number;
    queuedWorkers: number;
  };

  counters: {
    reserved: number;
    dispatched: number;
    published: number;
    failed: number;
    retried: number;
    deadLettered: number;
  };

  channels: Array<{
    channel: string;
    status: string;
    error?: string;
  }>;

  circuits: unknown[];
  runtimeMetrics: unknown;
  checkedAt: Date;
}

export interface PublisherDispatchBatchResult {
  success: boolean;
  workerId: string;
  requestedLimit: number;
  selected: number;
  reserved: number;
  published: number;
  failed: number;
  retrying: number;
  deadLettered: number;
  results: unknown[];
  startedAt: Date;
  finishedAt: Date;
  durationMs: number;
}

interface WorkerTask {
  execute: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

@Injectable()
export class PublisherDispatcherService
  implements OnApplicationShutdown
{
  private readonly logger = new Logger(
    PublisherDispatcherService.name,
  );

  private readonly workerId =
    process.env.PUBLISHER_WORKER_ID?.trim() ||
    `publisher-worker-${process.pid}-${randomUUID().slice(0, 8)}`;

  private readonly concurrency =
    this.readPositiveInteger(
      process.env.PUBLISHER_WORKER_CONCURRENCY,
      5,
    );

  private readonly defaultQueueLimit =
    this.readPositiveInteger(
      process.env.PUBLISHER_QUEUE_LIMIT,
      20,
    );

  private readonly maximumQueueLimit =
    this.readPositiveInteger(
      process.env.PUBLISHER_MAX_QUEUE_LIMIT,
      200,
    );

  private readonly workerQueue: WorkerTask[] = [];

  private acceptingJobs = true;
  private activeWorkers = 0;

  private reservedCount = 0;
  private dispatchedCount = 0;
  private publishedCount = 0;
  private failedCount = 0;
  private retriedCount = 0;
  private deadLetteredCount = 0;

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiActionLog: AiActionLogService,
    private readonly registry: PublisherRegistryService,
    private readonly moduleRef: ModuleRef,
    private readonly retryPolicy: PublisherRetryPolicyService,
    private readonly circuitBreaker: PublisherCircuitBreakerService,
    private readonly runtimeMetrics: PublisherRuntimeMetricsService,
    private readonly deadLetter: PublisherDeadLetterService,
    private readonly reservation: PublisherJobReservationService,
  ) {}

  async health(): Promise<PublisherDispatcherHealth> {
    const channels = await this.registry.health();

    return {
      success:
        this.acceptingJobs &&
        channels.every(
          (item) => item.status !== "offline",
        ),
      version: "v2",
      engine: "PublisherEngineV2",
      workerId: this.workerId,
      acceptingJobs: this.acceptingJobs,

      workerPool: {
        concurrency: this.concurrency,
        activeWorkers: this.activeWorkers,
        queuedWorkers: this.workerQueue.length,
      },

      counters: {
        reserved: this.reservedCount,
        dispatched: this.dispatchedCount,
        published: this.publishedCount,
        failed: this.failedCount,
        retried: this.retriedCount,
        deadLettered: this.deadLetteredCount,
      },

      channels,
      circuits: this.circuitBreaker.snapshot(),
      runtimeMetrics: this.runtimeMetrics.summary(),
      checkedAt: new Date(),
    };
  }

  async dispatchQueued(
    limit = this.defaultQueueLimit,
  ): Promise<PublisherDispatchBatchResult> {
    this.assertAcceptingJobs();

    const normalizedLimit = this.normalizeLimit(limit);
    const startedAt = new Date();

    await this.reservation.releaseExpired(
      this.readPositiveInteger(
        process.env.PUBLISHER_LOCK_TIMEOUT_MINUTES,
        10,
      ),
    );

    const reservationResult =
      await this.reservation.reserveBatch({
        workerId: this.workerId,
        limit: normalizedLimit,
      });

    const jobs = reservationResult.jobs;

    this.reservedCount += jobs.length;

    await Promise.all(
      jobs.map((job: any) =>
        this.audit(job, "JOB_RESERVED", "reserved"),
      ),
    );

    if (jobs.length === 0) {
      const finishedAt = new Date();

      return {
        success: true,
        workerId: this.workerId,
        requestedLimit: normalizedLimit,
        selected: 0,
        reserved: 0,
        published: 0,
        failed: 0,
        retrying: 0,
        deadLettered: 0,
        results: [],
        startedAt,
        finishedAt,
        durationMs:
          finishedAt.getTime() -
          startedAt.getTime(),
      };
    }

    const settled = await Promise.allSettled(
      jobs.map((job: any) =>
        this.enqueueWorker(() =>
          this.executeWithResilience(job),
        ),
      ),
    );

    const results = settled.map((entry) => {
      if (entry.status === "fulfilled") {
        return entry.value;
      }

      return {
        success: false,
        status: "failed",
        error: {
          message: this.errorMessage(entry.reason),
        },
      };
    });

    const published = results.filter(
      (result: any) =>
        this.extractStatus(result) === "published",
    ).length;

    const retrying = results.filter(
      (result: any) =>
        this.extractStatus(result) === "retrying",
    ).length;

    const deadLettered = results.filter(
      (result: any) =>
        this.extractStatus(result) === "dead",
    ).length;

    const failed =
      results.length -
      published -
      retrying;

    const finishedAt = new Date();

    return {
      success:
        failed === 0 &&
        deadLettered === 0,
      workerId: this.workerId,
      requestedLimit: normalizedLimit,
      selected: jobs.length,
      reserved: jobs.length,
      published,
      failed,
      retrying,
      deadLettered,
      results,
      startedAt,
      finishedAt,
      durationMs:
        finishedAt.getTime() -
        startedAt.getTime(),
    };
  }

  async dispatchOne(id: string): Promise<unknown> {
    this.assertAcceptingJobs();

    if (typeof id !== "string" || !id.trim()) {
      throw new Error(
        "Publisher job id is required",
      );
    }

    const reserved =
      await this.reservation.reserveOne(
        id.trim(),
        this.workerId,
      );

    if (!reserved) {
      const current = await (this.prisma as any).publishJob.findUnique({
        where: {
          id: id.trim(),
        },
      });

      if (!current) {
        throw new Error(
          `Publisher job "${id}" was not found`,
        );
      }

      throw new Error(
        `Publisher job "${id}" could not be reserved because it is already locked or is not dispatchable`,
      );
    }

    this.reservedCount += 1;

    await this.audit(
      reserved,
      "JOB_RESERVED",
      "reserved",
    );

    return this.enqueueWorker(() =>
      this.executeWithResilience(reserved),
    );
  }

  async onApplicationShutdown(): Promise<void> {
    this.acceptingJobs = false;

    while (this.workerQueue.length > 0) {
      const task = this.workerQueue.shift();

      task?.reject(
        new Error(
          "Publisher dispatcher stopped during application shutdown",
        ),
      );
    }
  }

  private async executeWithResilience(
    job: any,
  ): Promise<unknown> {
    const channel = this.channelOf(job);

    if (!this.registry.exists(channel)) {
      this.failedCount += 1;
      this.deadLetteredCount += 1;
      this.runtimeMetrics.recordDeadLetter(channel);

      const error = new Error(
        `Publisher channel "${channel}" is not registered`,
      );

      await this.audit(
        job,
        "JOB_FAILED",
        "failed",
      );

      const deadResult = await this.deadLetter.move(
        job,
        error,
      );

      await this.audit(
        job,
        "JOB_DEAD",
        "dead",
      );

      return deadResult;
    }

    if (!this.circuitBreaker.canExecute(channel)) {
      this.failedCount += 1;

      await this.requeueJob(
        job,
        Number(job.retryCount ?? 0),
        "Publisher circuit is open",
      );

      await this.audit(
        job,
        "JOB_RETRY",
        "retrying",
      );

      return {
        success: false,
        status: "retrying",
        channel,
        jobId: job.id,
        message:
          "Publisher circuit is open; job returned to retry queue",
      };
    }

    const initialAttempt =
      this.retryPolicy.currentAttempt(job);

    const maximumAttempts =
      this.maxAttempts(job);

    let lastResult: unknown;
    let lastError: unknown;

    for (
      let attempt = initialAttempt;
      attempt <= maximumAttempts;
      attempt += 1
    ) {
      const startedAt = Date.now();

      this.dispatchedCount += 1;
      this.runtimeMetrics.recordAttempt(channel);

      await this.audit(
        job,
        "JOB_STARTED",
        "processing",
      );

      try {
        lastResult = await this.executeCore(job);

        const status =
          this.extractStatus(lastResult);

        if (
          status === "published" ||
          status === "skipped"
        ) {
          this.publishedCount += 1;

          this.circuitBreaker.recordSuccess(channel);

          this.runtimeMetrics.recordSuccess(
            channel,
            Date.now() - startedAt,
          );

          await this.audit(
            job,
            "JOB_SUCCESS",
            status,
          );

          return lastResult;
        }

        lastError = new Error(
          this.extractMessage(lastResult) ||
            `Publisher returned status "${status}"`,
        );

        this.circuitBreaker.recordFailure(channel);

        this.runtimeMetrics.recordFailure(
          channel,
          Date.now() - startedAt,
        );

        const decision = this.retryPolicy.decide(
          {
            ...job,
            maxAttempts: maximumAttempts,
          },
          attempt,
          lastError,
          status,
        );

        if (!decision.retry) {
          break;
        }

        this.retriedCount += 1;
        this.runtimeMetrics.recordRetry(channel);

        await this.persistRetryState(
          job,
          attempt,
          this.errorMessage(lastError),
        );

        await this.audit(
          job,
          "JOB_RETRY",
          "retrying",
        );

        this.logger.warn(
          `Publisher retry: jobId=${job.id}, channel=${channel}, attempt=${attempt + 1}/${maximumAttempts}, delayMs=${decision.delayMs}`,
        );

        await this.delay(decision.delayMs);
      } catch (error) {
        lastError = error;

        this.circuitBreaker.recordFailure(channel);

        this.runtimeMetrics.recordFailure(
          channel,
          Date.now() - startedAt,
        );

        const decision = this.retryPolicy.decide(
          {
            ...job,
            maxAttempts: maximumAttempts,
          },
          attempt,
          error,
          "failed",
        );

        if (!decision.retry) {
          break;
        }

        this.retriedCount += 1;
        this.runtimeMetrics.recordRetry(channel);

        await this.persistRetryState(
          job,
          attempt,
          this.errorMessage(error),
        );

        await this.audit(
          job,
          "JOB_RETRY",
          "retrying",
        );

        this.logger.warn(
          `Publisher retry after exception: jobId=${job.id}, channel=${channel}, attempt=${attempt + 1}/${maximumAttempts}, delayMs=${decision.delayMs}, error=${this.errorMessage(error)}`,
        );

        await this.delay(decision.delayMs);
      }
    }

    this.failedCount += 1;
    this.deadLetteredCount += 1;
    this.runtimeMetrics.recordDeadLetter(channel);

    await this.audit(
      job,
      "JOB_FAILED",
      "failed",
    );

    const deadResult = await this.deadLetter.move(
      job,
      lastError ??
        new Error(
          this.extractMessage(lastResult) ||
            "Publisher attempts exhausted",
        ),
    );

    await this.audit(
      job,
      "JOB_DEAD",
      "dead",
    );

    return deadResult;
  }

  private async executeCore(
    job: any,
  ): Promise<unknown> {
    const core = this.moduleRef.get(
      PublisherDispatchCoreService,
      {
        strict: false,
      },
    );

    if (!core) {
      throw new Error(
        "PublisherDispatchCoreService is not registered in PublisherEngineModule",
      );
    }

    return core.dispatchOne(job);
  }

  private async persistRetryState(
    job: any,
    attempt: number,
    lastError: string,
  ): Promise<void> {
    await (this.prisma as any).publishJob.updateMany({
      where: {
        id: job.id,
        lockToken: job.lockToken,
        workerId: this.workerId,
      },
      data: {
        status: "retrying",
        retryCount: attempt,
        lastError: lastError.slice(0, 5000),
      },
    });

    job.retryCount = attempt;
    job.status = "retrying";
  }

  private async requeueJob(
    job: any,
    attempt: number,
    lastError: string,
  ): Promise<void> {
    await (this.prisma as any).publishJob.updateMany({
      where: {
        id: job.id,
        lockToken: job.lockToken,
        workerId: this.workerId,
      },
      data: {
        status: "retrying",
        retryCount: attempt,
        lastError: lastError.slice(0, 5000),
        workerId: null,
        lockToken: null,
        lockedAt: null,
      },
    });

    job.retryCount = attempt;
    job.status = "retrying";
    job.workerId = null;
    job.lockToken = null;
    job.lockedAt = null;
  }

  private maxAttempts(job: any): number {
    const maxRetries = Number(job?.maxRetries);

    if (
      Number.isInteger(maxRetries) &&
      maxRetries >= 0
    ) {
      return maxRetries + 1;
    }

    return this.retryPolicy.maxAttempts(job);
  }

  private enqueueWorker(
    execute: () => Promise<unknown>,
  ): Promise<unknown> {
    this.assertAcceptingJobs();

    return new Promise((resolve, reject) => {
      this.workerQueue.push({
        execute,
        resolve,
        reject,
      });

      this.drainWorkerQueue();
    });
  }

  private drainWorkerQueue(): void {
    while (
      this.acceptingJobs &&
      this.activeWorkers < this.concurrency &&
      this.workerQueue.length > 0
    ) {
      const task = this.workerQueue.shift();

      if (!task) {
        return;
      }

      this.activeWorkers += 1;

      void task
        .execute()
        .then(task.resolve)
        .catch(task.reject)
        .finally(() => {
          this.activeWorkers -= 1;
          this.drainWorkerQueue();
        });
    }
  }

  private channelOf(job: any): string {
    return String(
      job?.channel ??
        job?.result?.channel ??
        job?.result?.publisher?.channel ??
        "internal",
    )
      .trim()
      .toLowerCase();
  }

  private normalizeLimit(
    value: unknown,
  ): number {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
      return this.defaultQueueLimit;
    }

    return Math.min(
      Math.max(Math.trunc(numeric), 1),
      this.maximumQueueLimit,
    );
  }

  private extractStatus(result: any): string {
    const value =
      result?.status ??
      result?.result?.status ??
      result?.data?.status ??
      result?.job?.status;

    return typeof value === "string"
      ? value.toLowerCase()
      : "unknown";
  }

  private extractMessage(result: any): string {
    const value =
      result?.message ??
      result?.result?.message ??
      result?.error?.message;

    return typeof value === "string"
      ? value
      : "";
  }

  private assertAcceptingJobs(): void {
    if (!this.acceptingJobs) {
      throw new Error(
        "Publisher dispatcher is shutting down and no longer accepts jobs",
      );
    }
  }

  private delay(
    milliseconds: number,
  ): Promise<void> {
    if (milliseconds <= 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const timer = setTimeout(
        resolve,
        milliseconds,
      );

      timer.unref?.();
    });
  }

  private readPositiveInteger(
    value: string | undefined,
    fallback: number,
  ): number {
    const numeric = Number(value);

    return Number.isInteger(numeric) &&
      numeric > 0
      ? numeric
      : fallback;
  }

  private async audit(
    job: any,
    action: string,
    status: string,
  ): Promise<void> {
    const vehicleId = this.vehicleIdOf(job);

    if (!vehicleId) {
      return;
    }

    try {
      await this.aiActionLog.write(
        vehicleId,
        action,
        status,
      );
    } catch (error) {
      this.logger.warn(
        `Publisher audit log failed: jobId=${String(
          job?.id ?? "unknown",
        )}, vehicleId=${vehicleId}, action=${action}, error=${this.errorMessage(
          error,
        )}`,
      );
    }
  }

  private vehicleIdOf(
    job: any,
  ): string | null {
    const value =
      job?.result?.vehicleId ??
      job?.result?.metadata?.vehicleId ??
      job?.vehicleId ??
      null;

    if (
      typeof value !== "string" ||
      !value.trim()
    ) {
      return null;
    }

    return value.trim();
  }

  private errorMessage(
    error: unknown,
  ): string {
    return error instanceof Error
      ? error.message
      : String(
          error ?? "Unknown publisher error",
        );
  }
}


