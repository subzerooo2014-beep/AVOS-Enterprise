import { Injectable, NotFoundException } from "@nestjs/common";
import { SuperAppV5AuditService } from "./super-app-v5.audit.service";
import { SuperAppV5IdempotencyService } from "./super-app-v5.idempotency.service";
import { IntegrationJob } from "./super-app-v5.types";

@Injectable()
export class SuperAppV5QueueService {
  private readonly jobs = new Map<string, IntegrationJob>();

  constructor(
    private readonly idempotency: SuperAppV5IdempotencyService,
    private readonly audit: SuperAppV5AuditService,
  ) {}

  enqueue(input: {
    idempotencyKey: string;
    correlationId?: string;
    partnerId: string;
    requestId: string;
    jobType: string;
    payload: Record<string, unknown>;
    maxAttempts?: number;
  }): {
    duplicated: boolean;
    job: IntegrationJob;
  } {
    const existingId = this.idempotency.find(input.idempotencyKey);
    if (existingId) {
      return {
        duplicated: true,
        job: this.get(existingId),
      };
    }

    const now = new Date().toISOString();
    const job: IntegrationJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      idempotencyKey: input.idempotencyKey,
      correlationId:
        input.correlationId ??
        `corr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      partnerId: input.partnerId,
      requestId: input.requestId,
      jobType: input.jobType,
      payload: input.payload,
      status: "QUEUED",
      attempts: 0,
      maxAttempts: input.maxAttempts ?? 3,
      availableAt: now,
      createdAt: now,
      updatedAt: now,
    };

    this.jobs.set(job.id, job);
    this.idempotency.reserve(input.idempotencyKey, job.id);

    this.audit.record({
      action: "INTEGRATION_JOB_QUEUED",
      entityType: "IntegrationJob",
      entityId: job.id,
      correlationId: job.correlationId,
      metadata: {
        partnerId: job.partnerId,
        requestId: job.requestId,
        jobType: job.jobType,
      },
    });

    return {
      duplicated: false,
      job,
    };
  }

  get(id: string): IntegrationJob {
    const job = this.jobs.get(id);
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }

  list(): IntegrationJob[] {
    return [...this.jobs.values()];
  }

  processNext(): IntegrationJob | null {
    const now = Date.now();
    const job = this.list().find(
      (item) =>
        ["QUEUED", "FAILED"].includes(item.status) &&
        new Date(item.availableAt).getTime() <= now &&
        item.attempts < item.maxAttempts,
    );

    if (!job) return null;

    job.status = "RUNNING";
    job.attempts += 1;
    job.updatedAt = new Date().toISOString();

    job.status = "COMPLETED";
    job.lastError = undefined;
    job.updatedAt = new Date().toISOString();

    this.audit.record({
      action: "INTEGRATION_JOB_COMPLETED",
      entityType: "IntegrationJob",
      entityId: job.id,
      correlationId: job.correlationId,
      metadata: {
        attempts: job.attempts,
      },
    });

    return job;
  }

  fail(id: string, error: string): IntegrationJob {
    const job = this.get(id);
    job.lastError = error;

    if (job.attempts >= job.maxAttempts) {
      job.status = "DEAD_LETTER";
    } else {
      job.status = "FAILED";
      const delaySeconds = Math.min(300, Math.pow(2, job.attempts) * 5);
      job.availableAt = new Date(Date.now() + delaySeconds * 1000).toISOString();
    }

    job.updatedAt = new Date().toISOString();

    this.audit.record({
      action:
        job.status === "DEAD_LETTER"
          ? "INTEGRATION_JOB_DEAD_LETTERED"
          : "INTEGRATION_JOB_FAILED",
      entityType: "IntegrationJob",
      entityId: job.id,
      correlationId: job.correlationId,
      metadata: {
        error,
        attempts: job.attempts,
      },
    });

    return job;
  }

  retryDeadLetter(id: string): IntegrationJob {
    const job = this.get(id);
    job.status = "QUEUED";
    job.attempts = 0;
    job.lastError = undefined;
    job.availableAt = new Date().toISOString();
    job.updatedAt = new Date().toISOString();

    this.audit.record({
      action: "INTEGRATION_JOB_REQUEUED",
      entityType: "IntegrationJob",
      entityId: job.id,
      correlationId: job.correlationId,
    });

    return job;
  }

  dashboard() {
    const jobs = this.list();

    return {
      totalJobs: jobs.length,
      queued: jobs.filter((job) => job.status === "QUEUED").length,
      running: jobs.filter((job) => job.status === "RUNNING").length,
      completed: jobs.filter((job) => job.status === "COMPLETED").length,
      failed: jobs.filter((job) => job.status === "FAILED").length,
      deadLetter: jobs.filter((job) => job.status === "DEAD_LETTER").length,
      idempotencyKeys: this.idempotency.size(),
      totalAttempts: jobs.reduce((sum, job) => sum + job.attempts, 0),
    };
  }
}
