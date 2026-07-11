import {
  Injectable,
  Logger,
} from "@nestjs/common";

import { randomUUID } from "node:crypto";

@Injectable()
export class MockSocialDeliveryService {
  private readonly logger =
    new Logger(
      MockSocialDeliveryService.name,
    );

  deliver(
    channel: string,
    body: any,
    headers: Record<string, any>,
  ) {
    const normalizedChannel =
      String(channel)
        .trim()
        .toLowerCase();

    const supported = [
      "instagram",
      "tiktok",
      "google-search",
      "google_search",
    ];

    if (
      !supported.includes(
        normalizedChannel,
      )
    ) {
      throw new Error(
        `Unsupported mock delivery channel "${normalizedChannel}".`,
      );
    }

    const canonicalChannel =
      normalizedChannel === "google-search"
        ? "google_search"
        : normalizedChannel;

    const eventId =
      body?.eventId ??
      headers["x-avos-event-id"] ??
      null;

    const externalId =
      `mock-${canonicalChannel}-${randomUUID()}`;

    this.logger.log(
      `Mock social delivery completed: channel=${canonicalChannel}, eventId=${String(
        eventId ?? "unknown",
      )}, externalId=${externalId}`,
    );

    return {
      success: true,
      delivered: true,
      mock: true,
      channel: canonicalChannel,
      externalId,
      eventId,

      received: {
        accountId:
          body?.accountId ??
          body?.customerId ??
          null,

        attempt:
          body?.attempt ??
          headers["x-avos-attempt"] ??
          null,

        hasPayload:
          Boolean(body?.payload),

        hasPublication:
          Boolean(body?.publication),

        hasCampaign:
          Boolean(body?.campaign),

        vehicleId:
          body?.vehicle?.id ??
          body?.payload?.vehicle?.id ??
          null,
      },

      deliveredAt:
        new Date().toISOString(),
    };
  }
}
