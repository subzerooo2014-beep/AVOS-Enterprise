import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RuntimeQueueService } from '../../avos-enterprise-runtime/automation/runtime-queue.service';
import { RuntimePersistenceService } from '../persistence/runtime-persistence.service';

@Injectable()
export class DurableRuntimeQueueBridgeService implements OnModuleInit {
  private readonly logger = new Logger(
    DurableRuntimeQueueBridgeService.name,
  );

  constructor(
    private readonly queue: RuntimeQueueService,
    private readonly persistence: RuntimePersistenceService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.restoreQueuedJobs();
  }

  async persistJobs(): Promise<number> {
    const jobs = this.queue.list();

    for (const job of jobs) {
      await this.persistence.save(
        'jobs',
        job.type,
        job.id,
        job,
        job.status,
      );
    }

    return jobs.length;
  }

  async restoreQueuedJobs(): Promise<number> {
    const records = await this.persistence.list('jobs');
    let restored = 0;

    for (const record of records) {
      const job = record.payload as {
        type: string;
        payload: unknown;
        status: string;
        maxAttempts: number;
      };

      if (job.status === 'queued') {
        this.queue.enqueue(
          job.type,
          job.payload,
          job.maxAttempts,
        );
        restored += 1;
      }
    }

    if (restored > 0) {
      this.logger.log(`Restored ${restored} queued jobs`);
    }

    return restored;
  }
}