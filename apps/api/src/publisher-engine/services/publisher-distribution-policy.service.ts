import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherDistributionPolicyService {
  resolve(job: any) {
    if (job?.campaignId) return "campaign";
    if (job?.channelId) return "channel";
    return "default";
  }
}
