import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobExecutionContextService {
  create(job: any, channel: string) {
    return {
      job,
      channel,
      startedAt: new Date(),
      traceId: `trace_${job.id}_${Date.now()}`,
    };
  }
}
