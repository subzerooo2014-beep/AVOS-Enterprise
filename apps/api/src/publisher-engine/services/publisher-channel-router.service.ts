import { Injectable } from "@nestjs/common";
import { PublisherChannelUtil } from "../utils/publisher-channel.util";

@Injectable()
export class PublisherChannelRouterService {
  resolve(input?: string | null) {
    return PublisherChannelUtil.fallback(input);
  }

  website() {
    return this.resolve("website");
  }

  dealer() {
    return this.resolve("dealer_network");
  }

  crm() {
    return this.resolve("crm_leads");
  }

  buyers() {
    return this.resolve("matched_buyers");
  }

  export() {
    return this.resolve("gcc_export");
  }

  internal() {
    return this.resolve("internal");
  }
}
