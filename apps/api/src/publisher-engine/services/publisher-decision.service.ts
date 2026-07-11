import { Injectable } from "@nestjs/common";
import { PublisherCountryRouterService } from "./publisher-country-router.service";
import { PublisherCampaignRouterService } from "./publisher-campaign-router.service";

@Injectable()
export class PublisherDecisionService {
  constructor(
    private readonly country: PublisherCountryRouterService,
    private readonly campaign: PublisherCampaignRouterService,
  ) {}

  decide(input: any) {
    if (input?.campaign) {
      return this.campaign.resolve(input.campaign);
    }

    return this.country.resolve(input?.country);
  }
}
