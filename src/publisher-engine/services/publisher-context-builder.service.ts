import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherContextBuilderService {
  build(job: any) {
    return {
      jobId: job.id,
      vehicleId: job?.result?.entityId ?? null,
      channel: job?.result?.channel ?? "internal",
      title: job.title,
      content: job.content,
      metadata: job.result ?? {},
    };
  }
}
