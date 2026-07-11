import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobTimelineService {
  timeline(job: any) {
    return {
      id: job.id,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      publishedAt: job.publishedAt,
      failedAt: job.failedAt,
      status: job.status,
      retryCount: job.retryCount ?? 0,
    };
  }
}
