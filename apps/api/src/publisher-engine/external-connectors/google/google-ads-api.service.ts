import {
  Injectable,
  Logger,
} from "@nestjs/common";

import { BaseExternalHttpProvider } from "../base-external-http-provider";

@Injectable()
export class GoogleAdsApiService
  extends BaseExternalHttpProvider
{
  readonly channel =
    "google_search" as const;

  protected readonly logger =
    new Logger(
      GoogleAdsApiService.name,
    );

  protected endpoint(): string | null {
    return (
      process.env
        .GOOGLE_SEARCH_DELIVERY_URL
        ?.trim() ||
      null
    );
  }

  protected accessToken(): string | null {
    return (
      process.env
        .GOOGLE_ADS_ACCESS_TOKEN
        ?.trim() ||
      null
    );
  }

  protected accountId(): string | null {
    return (
      process.env
        .GOOGLE_ADS_CUSTOMER_ID
        ?.trim() ||
      null
    );
  }

  protected override buildRequestBody(
    request: any,
    accountId: string | null,
  ): any {
    const content =
      request.payload?.content ??
      {};

    return {
      platform: "google_search",
      customerId: accountId,
      eventId: request.eventId,
      attempt: request.attempt,

      campaign: {
        objective:
          content.campaign?.objective ??
          "high_intent_vehicle_leads",

        headline:
          content.headline ?? "",

        description:
          content.description ?? "",

        finalUrl:
          content.targetUrl ??
          null,

        keywords:
          content.keywords ?? [],

        country:
          content.campaign?.country ??
          "AE",

        language:
          content.campaign?.language ??
          "en",

        budgetMode:
          content.campaign?.budgetMode ??
          "organic",
      },

      vehicle:
        request.payload?.vehicle ??
        null,

      rawPayload:
        request.payload,
    };
  }
}
