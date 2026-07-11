import {
  Injectable,
  Logger,
} from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import { PublisherPlatformEventService } from "../channel-runtimes/publisher-platform-event.service";

@Injectable()
export class SocialPublicationEventService {
  private readonly logger =
    new Logger(
      SocialPublicationEventService.name,
    );

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: PublisherPlatformEventService,
  ) {}

  async createOrRefresh(input: {
    channel: string;
    vehicleId: string;
    payload: any;
    correlationId?: string | null;
  }): Promise<{
    eventId: string;
    operation: "created" | "refreshed";
    status: string;
  }> {
    const type =
      this.eventType(input.channel);

    const existing =
      await (this.prisma as any).platformEvent.findFirst({
        where: {
          type,
          entityType: "vehicle",
          entityId: input.vehicleId,

          status: {
            in: [
              "new",
              "queued",
              "pending",
            ],
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    const now = new Date();

    if (existing) {
      const updated =
        await (this.prisma as any).platformEvent.update({
          where: {
            id: existing.id,
          },

          data: {
            source:
              `publisher-engine.${input.channel}`,

            status: "queued",

            payload: {
              ...input.payload,
              channel: input.channel,
              vehicleId: input.vehicleId,
              correlationId:
                input.correlationId ?? null,
              refreshedAt:
                now.toISOString(),
            },

            result: {
              message:
                `${input.channel} publication request refreshed.`,
            },

            updatedAt: now,
          },
        });

      this.logger.log(
        `Social event refreshed: channel=${input.channel}, vehicleId=${input.vehicleId}, eventId=${updated.id}`,
      );

      return {
        eventId: updated.id,
        operation: "refreshed",
        status: updated.status,
      };
    }

    const created =
      await this.events.create({
        type,
        source:
          `publisher-engine.${input.channel}`,
        entityType: "vehicle",
        entityId: input.vehicleId,
        status: "queued",

        payload: {
          ...input.payload,
          channel: input.channel,
          vehicleId: input.vehicleId,
          correlationId:
            input.correlationId ?? null,
          createdAt:
            now.toISOString(),
        },

        result: {
          message:
            `${input.channel} publication queued.`,
        },
      });

    this.logger.log(
      `Social event created: channel=${input.channel}, vehicleId=${input.vehicleId}, eventId=${created.id}`,
    );

    return {
      eventId: created.id,
      operation: "created",
      status: created.status,
    };
  }

  private eventType(
    channel: string,
  ): string {
    switch (channel) {
      case "instagram":
        return "InstagramVehiclePublicationRequested";

      case "tiktok":
        return "TikTokVehiclePublicationRequested";

      case "google_search":
        return "GoogleSearchVehicleCampaignRequested";

      default:
        return "SocialVehiclePublicationRequested";
    }
  }
}
