import { Injectable } from "@nestjs/common";
import { PublisherChannelUtil } from "../utils/publisher-channel.util";

@Injectable()
export class PublisherChannelValidatorService {
  validate(channel?: string | null) {
    return {
      valid: PublisherChannelUtil.exists(channel),
      channel: PublisherChannelUtil.fallback(channel),
    };
  }
}
