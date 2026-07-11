import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherCampaignRouterService {
  resolve(campaign: any) {
    if (!campaign) {
      return "internal";
    }

    if (campaign.export === true) {
      return "gcc_export";
    }

    if (campaign.buyers === true) {
      return "matched_buyers";
    }

    return "website";
  }
}
