import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherPayloadBuilderService {
  build(job: any) {
    return {
      title: job.title,
      content: job.content ?? "",
      campaignId: job.campaignId ?? null,
      channelId: job.channelId ?? null,
      metadata: job.result ?? {},
    };
  }
}
