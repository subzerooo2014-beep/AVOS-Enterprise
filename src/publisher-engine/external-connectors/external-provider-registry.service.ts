import {
  Injectable,
  Logger,
} from "@nestjs/common";

import {
  ExternalProvider,
  ExternalProviderChannel,
} from "./external-provider.interface";

import { InstagramApiService } from "./instagram/instagram-api.service";
import { TikTokApiService } from "./tiktok/tiktok-api.service";
import { GoogleAdsApiService } from "./google/google-ads-api.service";

@Injectable()
export class ExternalProviderRegistryService {
  private readonly logger =
    new Logger(
      ExternalProviderRegistryService.name,
    );

  private readonly providers:
    Map<
      ExternalProviderChannel,
      ExternalProvider
    >;

  constructor(
    instagram: InstagramApiService,
    tiktok: TikTokApiService,
    googleSearch: GoogleAdsApiService,
  ) {
    this.providers = new Map<
      ExternalProviderChannel,
      ExternalProvider
    >([
      [
        instagram.channel,
        instagram,
      ],
      [
        tiktok.channel,
        tiktok,
      ],
      [
        googleSearch.channel,
        googleSearch,
      ],
    ]);

    this.logger.log(
      `External providers registered: ${Array.from(
        this.providers.keys(),
      ).join(", ")}`,
    );
  }

  get(
    channel: ExternalProviderChannel,
  ): ExternalProvider {
    const provider =
      this.providers.get(channel);

    if (!provider) {
      throw new Error(
        `External provider "${channel}" is not registered.`,
      );
    }

    return provider;
  }

  list(): Array<{
    channel: ExternalProviderChannel;
    configured: boolean;
  }> {
    return Array.from(
      this.providers.values(),
    ).map((provider) => ({
      channel:
        provider.channel,
      configured:
        provider.configured(),
    }));
  }

  async health(): Promise<any[]> {
    return Promise.all(
      Array.from(
        this.providers.values(),
      ).map((provider) =>
        provider.health(),
      ),
    );
  }
}
