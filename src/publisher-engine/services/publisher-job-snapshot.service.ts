import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobSnapshotService {
  snapshot(job: any) {
    return {
      id: job.id,
      title: job.title,
      status: job.status,
      priority: job.priority,
      retryCount: job.retryCount,
      workerId: job.workerId,
      lockedAt: job.lockedAt,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
