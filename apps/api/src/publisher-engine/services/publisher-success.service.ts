import { Injectable } from "@nestjs/common";
import { PublisherJobWriterService } from "./publisher-job-writer.service";
import { PublisherResult } from "../contracts/publisher.types";

@Injectable()
export class PublisherSuccessService {
  constructor(private readonly writer: PublisherJobWriterService) {}

  async complete(job: any, result: PublisherResult, executionMs: number) {
    return this.writer.update(job.id, {
      status: result.status,
      publishedAt: result.status === "published" ? new Date() : null,
      lockedAt: null,
      lockToken: null,
      workerId: null,
      lastError: null,
      result: {
        ...(job.result ?? {}),
        publisher: result,
        execution: {
          executionMs,
          completedAt: new Date().toISOString(),
        },
      },
    });
  }
}
