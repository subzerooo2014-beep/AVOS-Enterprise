import { Injectable } from "@nestjs/common";
import { PublisherJobWriterService } from "./publisher-job-writer.service";
import { makeLockToken } from "../utils/publisher-id.util";
import { PUBLISHER_WORKER_ID } from "../constants/publisher-status.constants";

@Injectable()
export class PublisherLockService {
  constructor(private readonly writer: PublisherJobWriterService) {}

  async lock(job: any) {
    const lockToken = makeLockToken(job.id);
    return this.writer.update(job.id, {
      status: "processing",
      startedAt: job.startedAt ?? new Date(),
      lockedAt: new Date(),
      lockToken,
      workerId: PUBLISHER_WORKER_ID,
      correlationId: job.correlationId ?? `pub_${job.id}_${Date.now()}`,
    });
  }

  async release(id: string) {
    return this.writer.update(id, {
      lockedAt: null,
      lockToken: null,
      workerId: null,
    });
  }
}
