import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobRouteResultService {
  result(job: any, channel: string, allowed: boolean) {
    return {
      jobId: job.id,
      channel,
      allowed,
      generatedAt: new Date(),
    };
  }
}
