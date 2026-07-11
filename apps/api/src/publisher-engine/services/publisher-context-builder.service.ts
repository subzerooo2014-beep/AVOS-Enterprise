import { Injectable } from "@nestjs/common";
import { PublisherContext } from "../contracts/publisher.types";
import { makeCorrelationId } from "../utils/publisher-id.util";
import { safeObject } from "../utils/publisher-object.util";

@Injectable()
export class PublisherContextBuilderService {
  build(job: any): PublisherContext {
    const result = safeObject(job.result);
    const channel = result.channel ?? result.publisher?.channel ?? this.channelFromTitle(job.title);

    return {
      jobId: job.id,
      vehicleId: result.entityId ?? result.vehicleId ?? this.vehicleFromContent(job.content),
      campaignId: job.campaignId ?? null,
      channelId: job.channelId ?? null,
      channel,
      title: job.title,
      content: job.content,
      result,
      attempt: Number(job.retryCount ?? 0) + 1,
      correlationId: job.correlationId ?? makeCorrelationId(job.id),
      metadata: result.metadata ?? {},
    };
  }

  private channelFromTitle(title: string) {
    const lower = String(title ?? "").toLowerCase();
    const known = ["website", "dealer_network", "crm_leads", "matched_buyers", "gcc_export", "internal"];
    return known.find((k) => lower.includes(k)) ?? "internal";
  }

  private vehicleFromContent(content: string) {
    const match = String(content ?? "").match(/cmr[a-z0-9]+/i);
    return match ? match[0] : null;
  }
}
