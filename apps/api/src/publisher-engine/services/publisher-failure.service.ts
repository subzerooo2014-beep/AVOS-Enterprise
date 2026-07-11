import { Injectable } from "@nestjs/common";
import { PublisherJobWriterService } from "./publisher-job-writer.service";
import { PublisherRetryPolicy } from "../policies/publisher-retry.policy";

@Injectable()
export class PublisherFailureService {
  constructor(private readonly writer: PublisherJobWriterService) {}

  async fail(job: any, error: any) {
    const retryCount = Number(job.retryCount ?? 0) + 1;
    const finalStatus = PublisherRetryPolicy.nextStatus({ ...job, retryCount });

    return this.writer.update(job.id, {
      status: finalStatus,
      retryCount,
      failedAt: finalStatus === "dead" ? new Date() : null,
      lastError: error?.message ?? "Publisher failed",
      result: {
        ...(job.result ?? {}),
        publisher: {
          status: "failed",
          message: error?.message ?? "Publisher failed",
          retryCount,
          finalStatus,
        },
      },
    });
  }
}
