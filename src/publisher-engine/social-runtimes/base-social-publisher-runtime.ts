import { Logger } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

import {
  PublisherContext,
  PublisherResult,
} from "../contracts/publisher.types";

import { PublisherVehicleContextService } from "../channel-runtimes/publisher-vehicle-context.service";
import { SocialContentBuilderService } from "./social-content-builder.service";
import { SocialPublicationEventService } from "./social-publication-event.service";

export abstract class BaseSocialPublisherRuntime {
  protected abstract readonly channel: string;
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly vehicles: PublisherVehicleContextService,
    protected readonly contentBuilder: SocialContentBuilderService,
    protected readonly publicationEvents: SocialPublicationEventService,
  ) {}

  async publish(
    context: PublisherContext,
  ): Promise<PublisherResult> {
    const vehicle =
      await this.vehicles.loadVehicle(
        this.prisma as any,
        context,
      );

    const content =
      this.contentBuilder.build(
        this.channel,
        vehicle,
        context,
      );

    const publication =
      await this.publicationEvents.createOrRefresh({
        channel: this.channel,
        vehicleId: vehicle.id,

        payload: {
          vehicle: {
            id: vehicle.id,
            vin: vehicle.vin,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            color: vehicle.color,
            status: vehicle.status,

            location:
              vehicle.location ??
              vehicle.inventory?.location ??
              null,

            price:
              this.vehicles.price(
                vehicle,
                context,
              ),

            trim: vehicle.trim
              ? {
                  id: vehicle.trim.id,
                  name: vehicle.trim.name,
                  engine: vehicle.trim.engine,
                  gearbox: vehicle.trim.gearbox,
                  fuelType:
                    vehicle.trim.fuelType,
                }
              : null,
          },

          content,

          campaign: {
            ...content.campaign,
            targetUrl:
              content.targetUrl,
          },

          publisher: {
            engine:
              "PublisherEngineV2",
            runtime:
              `${this.channel}-runtime-v1`,
            attempt:
              context.attempt,
          },
        },

        correlationId:
          context.correlationId,
      });

    await this.prisma.auditLog.create({
      data: {
        action:
          `${this.channel
            .toUpperCase()}_PUBLICATION_QUEUED`,

        entity: "Vehicle",
        entityId: vehicle.id,
      },
    });

    this.logger.log(
      `Social publication queued: channel=${this.channel}, vehicleId=${vehicle.id}, eventId=${publication.eventId}`,
    );

    return {
      status: "published",
      channel: this.channel,

      externalId:
        `${this.channel}:${publication.eventId}`,

      message:
        `${this.channel} vehicle publication queued successfully.`,

      metadata: {
        vehicleId: vehicle.id,
        eventId: publication.eventId,
        operation:
          publication.operation,

        deliveryStatus:
          publication.status,

        content,
        attempt:
          context.attempt,

        correlationId:
          context.correlationId,
      },
    };
  }
}
