import { PublisherContext } from "../contracts/publisher.types";

export class PublisherContextUtil {
  static create(job: any): PublisherContext {
    const result = job.result ?? {};

    return {
      jobId: job.id,
      vehicleId: result.entityId ?? null,
      campaignId: job.campaignId ?? null,
      channelId: job.channelId ?? null,
      channel: result.channel ?? "internal",
      title: job.title,
      content: job.content,
      result,
      attempt: Number(job.retryCount ?? 0) + 1,
      correlationId: job.correlationId ?? `pub_${job.id}`,
      metadata: result.metadata ?? {},
    };
  }
}
