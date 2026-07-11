import {
  Injectable,
  Logger,
} from "@nestjs/common";

import { ExternalDeliveryService } from "../external-connectors/external-delivery.service";

import {
  SocialDeliveryChannel,
  SocialDeliveryResult,
} from "./social-delivery.contracts";

@Injectable()
export class SocialHttpDeliveryService {
  private readonly logger =
    new Logger(
      SocialHttpDeliveryService.name,
    );

  constructor(
    private readonly externalDelivery: ExternalDeliveryService,
  ) {}

  async deliver(input: {
    channel: SocialDeliveryChannel;
    eventId: string;
    payload: any;
    attempt: number;
  }): Promise<SocialDeliveryResult> {
    const completedAt =
      new Date();

    const result =
      await this.externalDelivery.deliver({
        channel:
          input.channel,
        eventId:
          input.eventId,
        payload:
          input.payload,
        attempt:
          input.attempt,
      });

    if (
      result.status ===
      "awaiting_credentials"
    ) {
      return {
        success: false,
        channel:
          input.channel,
        eventId:
          input.eventId,
        status:
          "awaiting_credentials",
        attempt:
          input.attempt,
        message:
          result.message,
        response:
          result.response,
        completedAt,
      };
    }

    if (!result.success) {
      this.logger.warn(
        `Connector delivery failed: channel=${input.channel}, eventId=${input.eventId}, error=${result.message}`,
      );

      return {
        success: false,
        channel:
          input.channel,
        eventId:
          input.eventId,
        status:
          "retrying",
        attempt:
          input.attempt,
        message:
          result.message,
        response:
          result.response,
        completedAt,
      };
    }

    return {
      success: true,
      channel:
        input.channel,
      eventId:
        input.eventId,
      status:
        "delivered",
      attempt:
        input.attempt,
      externalId:
        result.externalId ??
        null,
      message:
        result.message,
      response:
        result.response,
      completedAt,
    };
  }
}
