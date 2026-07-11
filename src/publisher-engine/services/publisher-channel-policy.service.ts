import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherChannelPolicyService {
  enabled(channel: string) {
    return [
      "website",
      "dealer_network",
      "crm_leads",
      "matched_buyers",
      "gcc_export",
      "internal",
    ].includes(channel);
  }
}
