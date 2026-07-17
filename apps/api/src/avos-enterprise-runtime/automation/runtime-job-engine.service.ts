import { Injectable } from '@nestjs/common';
import { RuntimeQueueService } from './runtime-queue.service';
import { RuntimeEventBusService } from '../events/runtime-event-bus.service';

type JobHandler = (payload: unknown) => unknown | Promise<unknown>;

@Injectable()
export class RuntimeJobEngineService {
  private readonly handlers = new Map<string, JobHandler>();

  constructor(
    private readonly queue: RuntimeQueueService,
    private readonly events: RuntimeEventBusService,
  ) {}

  register(type: string, handler: JobHandler): void {
    this.handlers.set(type, handler);
  }

  async runNext(type?: string): Promise<unknown> {
    const job = this.queue.next(type);
    if (!job) return undefined;

    const handler = this.handlers.get(job.type);
    if (!handler) {
      this.queue.fail(job.id, `No handler for job type ${job.type}`);
      throw new Error(`No handler for job type ${job.type}`);
    }

    this.events.publish({
      type: 'runtime.job.started',
      source: 'runtime-job-engine',
      payload: { jobId: job.id, type: job.type },
    });

    try {
      const result = await handler(job.payload);
      this.queue.complete(job.id);
      this.events.publish({
        type: 'runtime.job.completed',
        source: 'runtime-job-engine',
        payload: { jobId: job.id, type: job.type },
      });
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      this.queue.fail(job.id, message);
      this.events.publish({
        type: 'runtime.job.failed',
        source: 'runtime-job-engine',
        payload: { jobId: job.id, type: job.type, error: message },
      });
      throw error;
    }
  }
}