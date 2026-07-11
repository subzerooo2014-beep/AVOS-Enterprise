import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobProfilerService {
  profile(job: any) {
    return {
      id: job.id,
      status: job.status,
      priority: job.priority,
      retries: job.retryCount,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      executionMs: job?.result?.execution?.executionMs ?? 0,
    };
  }
}
