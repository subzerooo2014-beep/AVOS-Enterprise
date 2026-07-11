import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobReporterService {
  report(job: any, result: any) {
    return {
      jobId: job.id,
      status: result.status,
      channel: result.channel,
      message: result.message,
      generatedAt: new Date(),
    };
  }
}
