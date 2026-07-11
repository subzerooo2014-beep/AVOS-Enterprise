import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobHealthService {
  check(job: any) {
    return {
      healthy: !["dead"].includes(job.status),
      status: job.status,
      retries: job.retryCount ?? 0,
      locked: !!job.lockedAt,
      generatedAt: new Date(),
    };
  }
}
