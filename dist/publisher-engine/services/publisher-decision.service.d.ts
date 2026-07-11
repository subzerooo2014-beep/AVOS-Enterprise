import { PublisherCountryRouterService } from "./publisher-country-router.service";
import { PublisherCampaignRouterService } from "./publisher-campaign-router.service";
export declare class PublisherDecisionService {
    private readonly country;
    private readonly campaign;
    constructor(country: PublisherCountryRouterService, campaign: PublisherCampaignRouterService);
    decide(input: any): string;
}
