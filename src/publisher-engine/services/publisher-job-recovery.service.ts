import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobRecoveryService {
  recover(job: any) {
    return {
      ...job,
      status: "queued",
      retryCount: Number(job.retryCount ?? 0) + 1,
      lockedAt: null,
      lockToken: null,
      workerId: null,
      lastError: null,
      updatedAt: new Date(),
    };
  }
}
