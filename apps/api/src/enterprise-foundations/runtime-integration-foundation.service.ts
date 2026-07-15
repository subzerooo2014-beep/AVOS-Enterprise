import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { RuntimeJob } from "./enterprise-foundations.types";

@Injectable()
export class RuntimeIntegrationFoundationService {
  private readonly jobs = new Map<string, RuntimeJob>();
  private readonly idempotencyIndex = new Map<string, string>();

  enqueue(
    input: Omit<
      RuntimeJob,
      "id" | "status" | "attempts" | "createdAt" | "updatedAt"
    >,
  ): RuntimeJob {
    const existingId = this.idempotencyIndex.get(input.idempotencyKey);

    if (existingId) {
      return this.clone(this.requireJob(existingId));
    }

    const now = new Date().toISOString();

    const job: RuntimeJob = {
      ...input,
      id: randomUUID(),
      status: "QUEUED",
      attempts: 0,
      payload: { ...input.payload },
      createdAt: now,
      updatedAt: now,
    };

    this.jobs.set(job.id, job);
    this.idempotencyIndex.set(job.idempotencyKey, job.id);

    return this.clone(job);
  }

  updateStatus(
    id: string,
    status: RuntimeJob["status"],
  ): RuntimeJob {
    const job = this.requireJob(id);

    job.status = status;
    job.attempts += 1;
    job.updatedAt = new Date().toISOString();

    this.jobs.set(id, job);
    return this.clone(job);
  }

  dashboard() {
    const jobs = Array.from(this.jobs.values());

    return {
      jobs: jobs.length,
      queued: jobs.filter((item) => item.status === "QUEUED").length,
      running: jobs.filter((item) => item.status === "RUNNING").length,
      completed: jobs.filter((item) => item.status === "COMPLETED").length,
      failed: jobs.filter((item) => item.status === "FAILED").length,
      deadLetter: jobs.filter(
        (item) => item.status === "DEAD_LETTER",
      ).length,
      idempotencyKeys: this.idempotencyIndex.size,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireJob(id: string): RuntimeJob {
    const job = this.jobs.get(id);

    if (!job) {
      throw new Error(`Runtime job not found: ${id}`);
    }

    return job;
  }

  private clone(job: RuntimeJob): RuntimeJob {
    return {
      ...job,
      payload: { ...job.payload },
    };
  }
}