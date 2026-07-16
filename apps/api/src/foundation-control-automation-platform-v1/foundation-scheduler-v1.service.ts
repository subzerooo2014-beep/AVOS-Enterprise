import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationScheduledJobV1 } from "./foundation-control-automation-v1.types";

@Injectable()
export class FoundationSchedulerV1Service {
  private readonly jobs = new Map<string, FoundationScheduledJobV1>();

  upsert(
    input: Omit<FoundationScheduledJobV1, "lastRunAt" | "updatedAt">,
  ): FoundationScheduledJobV1 {
    const job: FoundationScheduledJobV1 = {
      ...input,
      payload: { ...input.payload },
      updatedAt: new Date().toISOString(),
    };

    this.jobs.set(job.id, job);
    return this.clone(job);
  }

  run(id: string): FoundationScheduledJobV1 {
    const job = this.requireJob(id);

    if (job.status === "DISABLED") {
      throw new Error(`Scheduled job '${id}' is disabled.`);
    }

    job.status = "COMPLETED";
    job.lastRunAt = new Date().toISOString();
    job.updatedAt = job.lastRunAt;

    return this.clone(job);
  }

  list(): FoundationScheduledJobV1[] {
    return Array.from(this.jobs.values()).map((job) => this.clone(job));
  }

  count(): number {
    return this.jobs.size;
  }

  private requireJob(id: string): FoundationScheduledJobV1 {
    const job = this.jobs.get(id);
    if (!job) {
      throw new NotFoundException(`Scheduled job '${id}' was not found.`);
    }
    return job;
  }

  private clone(job: FoundationScheduledJobV1): FoundationScheduledJobV1 {
    return { ...job, payload: { ...job.payload } };
  }
}
