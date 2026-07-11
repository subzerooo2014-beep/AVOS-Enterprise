import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobReaderV2Service {
  readable(job: any) {
    return {
      id: job.id,
      title: job.title,
      content: job.content,
      status: job.status,
      priority: job.priority,
      campaignId: job.campaignId,
      channelId: job.channelId,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
