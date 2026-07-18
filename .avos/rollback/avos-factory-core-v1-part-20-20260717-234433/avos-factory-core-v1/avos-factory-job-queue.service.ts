import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import { AvosFactoryJob } from "./avos-factory-operations.contracts";
import { AvosFactoryAuditService } from "./avos-factory-audit.service";
import { AvosFactoryLifecycleService } from "./avos-factory-lifecycle.service";

@Injectable()
export class AvosFactoryJobQueueService {
  private readonly jobs: AvosFactoryJob[] = [];

  constructor(
    private readonly lifecycle: AvosFactoryLifecycleService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  enqueue(input: {
    type: AvosFactoryJob["type"];
    subjectId: string;
    actor: string;
    approvedBy?: string;
    humanApproved: boolean;
    payload?: Record<string, unknown>;
    maxAttempts?: number;
    priority?: number;
    scheduledFor?: string;
  }): AvosFactoryJob {
    this.lifecycle.assertOperational();

    if (
      input.type === "certification" &&
      (
        input.humanApproved !== true ||
        !input.approvedBy?.trim()
      )
    ) {
      throw new BadRequestException(
        "Certification jobs require Human Final Authority approval."
      );
    }

    const job: AvosFactoryJob = {
      id: randomUUID(),
      type: input.type,
      subjectId: input.subjectId,
      actor: input.actor,
      approvedBy: input.approvedBy,
      humanApproved: input.humanApproved,
      payload: structuredClone(input.payload ?? {}),
      status: "queued",
      attempts: 0,
      maxAttempts: Math.max(1, Math.min(input.maxAttempts ?? 3, 10)),
      priority: Math.max(0, Math.min(input.priority ?? 5, 10)),
      scheduledFor: input.scheduledFor ?? new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    this.jobs.push(job);
    this.sortQueue();

    this.audit.append({
      category: "operations",
      action: "factory-job-enqueued",
      actor: input.actor,
      approvedBy: input.approvedBy,
      success: true,
      resourceId: job.id,
      details: {
        type: job.type,
        subjectId: job.subjectId,
        priority: job.priority
      }
    });

    return structuredClone(job);
  }

  dequeueReady(): AvosFactoryJob | undefined {
    this.lifecycle.assertOperational();

    const now = Date.now();
    const job = this.jobs.find(
      (candidate) =>
        candidate.status === "queued" &&
        new Date(candidate.scheduledFor).getTime() <= now
    );

    if (!job) {
      return undefined;
    }

    job.status = "running";
    job.attempts += 1;
    job.startedAt = new Date().toISOString();

    return structuredClone(job);
  }

  complete(
    jobId: string,
    result?: Record<string, unknown>
  ): AvosFactoryJob {
    const job = this.requireJob(jobId);

    job.status = "completed";
    job.completedAt = new Date().toISOString();

    if (result) {
      job.payload = {
        ...job.payload,
        result: structuredClone(result)
      };
    }

    return structuredClone(job);
  }

  fail(
    jobId: string,
    error: string
  ): AvosFactoryJob {
    const job = this.requireJob(jobId);

    job.status = "failed";
    job.lastError = error;
    job.failedAt = new Date().toISOString();

    return structuredClone(job);
  }

  requeue(jobId: string): AvosFactoryJob {
    const job = this.requireJob(jobId);

    if (job.attempts >= job.maxAttempts) {
      throw new BadRequestException(
        `Job ${jobId} exhausted retry attempts.`
      );
    }

    job.status = "queued";
    job.startedAt = undefined;
    job.failedAt = undefined;
    job.scheduledFor = new Date().toISOString();

    this.sortQueue();

    return structuredClone(job);
  }

  deadLetter(jobId: string): AvosFactoryJob {
    const job = this.requireJob(jobId);
    job.status = "dead-lettered";
    return structuredClone(job);
  }

  cancel(input: {
    jobId: string;
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
  }): AvosFactoryJob {
    if (
      input.humanApproved !== true ||
      !input.approvedBy?.trim()
    ) {
      throw new BadRequestException(
        "Job cancellation requires Human Final Authority approval."
      );
    }

    const job = this.requireJob(input.jobId);
    job.status = "cancelled";

    return structuredClone(job);
  }

  get(jobId: string): AvosFactoryJob {
    return structuredClone(this.requireJob(jobId));
  }

  list(limit = 100): AvosFactoryJob[] {
    return this.jobs
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((job) => structuredClone(job));
  }

  all(): AvosFactoryJob[] {
    return this.jobs.map((job) => structuredClone(job));
  }

  private requireJob(jobId: string): AvosFactoryJob {
    const job = this.jobs.find(
      (candidate) => candidate.id === jobId
    );

    if (!job) {
      throw new BadRequestException(
        `Factory job not found: ${jobId}`
      );
    }

    return job;
  }

  private sortQueue(): void {
    this.jobs.sort(
      (left, right) =>
        right.priority - left.priority ||
        new Date(left.scheduledFor).getTime() -
        new Date(right.scheduledFor).getTime()
    );
  }
}
