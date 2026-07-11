import {
  Injectable,
  Logger,
} from "@nestjs/common";

import { BaseExternalHttpProvider } from "../base-external-http-provider";

@Injectable()
export class InstagramApiService
  extends BaseExternalHttpProvider
{
  readonly channel =
    "instagram" as const;

  protected readonly logger =
    new Logger(
      InstagramApiService.name,
    );

  protected endpoint(): string | null {
    return (
      process.env
        .INSTAGRAM_DELIVERY_URL
        ?.trim() ||
      null
    );
  }

  protected accessToken(): string | null {
    return (
      process.env
        .INSTAGRAM_ACCESS_TOKEN
        ?.trim() ||
      null
    );
  }

  protected accountId(): string | null {
    return (
      process.env
        .INSTAGRAM_ACCOUNT_ID
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
      platform: "instagram",
      accountId,
      eventId: request.eventId,
      attempt: request.attempt,

      publication: {
        caption:
          content.caption ?? "",
        imageUrl:
          content.media?.imageUrl ??
          null,
        videoUrl:
          content.media?.videoUrl ??
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
