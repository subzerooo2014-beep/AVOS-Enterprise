import { Injectable } from '@nestjs/common';
import { RuntimeJob } from '../contracts/runtime.contracts';
import { clone, createRuntimeId, nowIso } from '../shared/runtime.utils';

@Injectable()
export class RuntimeQueueService {
  private readonly jobs = new Map<string, RuntimeJob>();

  enqueue<T>(
    type: string,
    payload: T,
    maxAttempts = 3,
  ): RuntimeJob<T> {
    const timestamp = nowIso();
    const job: RuntimeJob<T> = {
      id: createRuntimeId('job'),
      type,
      payload,
      status: 'queued',
      attempts: 0,
      maxAttempts,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.jobs.set(job.id, job as RuntimeJob);
    return clone(job);
  }

  next(type?: string): RuntimeJob | undefined {
    const job = [...this.jobs.values()].find(
      (item) =>
        item.status === 'queued' && (!type || item.type === type),
    );

    if (!job) return undefined;

    job.status = 'running';
    job.attempts += 1;
    job.updatedAt = nowIso();
    return clone(job);
  }

  complete(id: string): RuntimeJob {
    const job = this.require(id);
    job.status = 'completed';
    job.updatedAt = nowIso();
    return clone(job);
  }

  fail(id: string, error: string): RuntimeJob {
    const job = this.require(id);
    job.error = error;
    job.status =
      job.attempts < job.maxAttempts ? 'queued' : 'failed';
    job.updatedAt = nowIso();
    return clone(job);
  }

  list(): RuntimeJob[] {
    return [...this.jobs.values()].map((job) => clone(job));
  }

  count(): number {
    return this.jobs.size;
  }

  private require(id: string): RuntimeJob {
    const job = this.jobs.get(id);
    if (!job) throw new Error(`Runtime job not found: ${id}`);
    return job;
  }
}