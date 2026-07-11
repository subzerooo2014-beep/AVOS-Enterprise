import { Injectable } from "@nestjs/common";
import { PublisherRegistryService } from "../publisher-registry.service";
import { PublisherChannelUtil } from "../utils/publisher-channel.util";

@Injectable()
export class PublisherChannelService {
  constructor(
    private readonly registry: PublisherRegistryService,
  ) {}

  all() {
    return this.registry.list();
  }

  resolve(channel?: string | null) {
    return PublisherChannelUtil.fallback(channel);
  }

  adapter(channel?: string | null) {
    return this.registry.get(this.resolve(channel));
  }

  exists(channel?: string | null) {
    return PublisherChannelUtil.exists(channel);
  }
}
