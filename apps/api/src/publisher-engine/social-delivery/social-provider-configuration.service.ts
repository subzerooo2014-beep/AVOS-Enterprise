import { Injectable } from "@nestjs/common";

import {
  SocialDeliveryChannel,
  SocialProviderConfiguration,
} from "./social-delivery.contracts";

@Injectable()
export class SocialProviderConfigurationService {
  get(
    channel: SocialDeliveryChannel,
  ): SocialProviderConfiguration {
    switch (channel) {
      case "instagram":
        return this.configuration(
          channel,
          process.env.INSTAGRAM_DELIVERY_URL,
          process.env.INSTAGRAM_ACCESS_TOKEN,
          process.env.INSTAGRAM_ACCOUNT_ID,
        );

      case "tiktok":
        return this.configuration(
          channel,
          process.env.TIKTOK_DELIVERY_URL,
          process.env.TIKTOK_ACCESS_TOKEN,
          process.env.TIKTOK_ACCOUNT_ID,
        );

      case "google_search":
        return this.configuration(
          channel,
          process.env.GOOGLE_SEARCH_DELIVERY_URL,
          process.env.GOOGLE_ADS_ACCESS_TOKEN,
          process.env.GOOGLE_ADS_CUSTOMER_ID,
        );
    }
  }

  all(): SocialProviderConfiguration[] {
    return [
      this.get("instagram"),
      this.get("tiktok"),
      this.get("google_search"),
    ];
  }

  private configuration(
    channel: SocialDeliveryChannel,
    endpoint: string | undefined,
    accessToken: string | undefined,
    accountId: string | undefined,
  ): SocialProviderConfiguration {
    const normalizedEndpoint =
      endpoint?.trim() || null;

    const normalizedToken =
      accessToken?.trim() || null;

    const normalizedAccountId =
      accountId?.trim() || null;

    return {
      channel,
      endpoint: normalizedEndpoint,
      accessToken: normalizedToken,
      accountId: normalizedAccountId,

      timeoutMs:
        this.positiveInteger(
          process.env.SOCIAL_DELIVERY_TIMEOUT_MS,
          20_000,
        ),

      configured:
        Boolean(normalizedEndpoint),
    };
  }

  private positiveInteger(
    value: string | undefined,
    fallback: number,
  ): number {
    const numeric = Number(value);

    return Number.isInteger(numeric) &&
      numeric > 0
      ? numeric
      : fallback;
  }
}
