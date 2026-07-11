import {
  Injectable,
  Logger,
} from "@nestjs/common";

import { BaseExternalHttpProvider } from "../base-external-http-provider";

@Injectable()
export class TikTokApiService
  extends BaseExternalHttpProvider
{
  readonly channel =
    "tiktok" as const;

  protected readonly logger =
    new Logger(
      TikTokApiService.name,
    );

  protected endpoint(): string | null {
    return (
      process.env
        .TIKTOK_DELIVERY_URL
        ?.trim() ||
      null
    );
  }

  protected accessToken(): string | null {
    return (
      process.env
        .TIKTOK_ACCESS_TOKEN
        ?.trim() ||
      null
    );
  }

  protected accountId(): string | null {
    return (
      process.env
        .TIKTOK_ACCOUNT_ID
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
      platform: "tiktok",
      accountId,
      eventId: request.eventId,
      attempt: request.attempt,

      publication: {
        title:
          content.headline ?? "",
        caption:
          content.caption ?? "",
        videoUrl:
          content.media?.videoUrl ??
          null,
        imageUrl:
          content.media?.imageUrl ??
          null,
        targetUrl:
          content.targetUrl ??
          null,
        hashtags:
          content.hashtags ?? [],
      },

      vehicle:
        request.payload?.vehicle ??
        null,

      rawPayload:
        request.payload,
    };
  }
}
