import {
  Injectable,
  Logger,
} from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import {
  PublisherContext,
  PublisherResult,
} from "../contracts/publisher.types";

import { PublisherVehicleContextService } from "./publisher-vehicle-context.service";
import { PublisherPlatformEventService } from "./publisher-platform-event.service";

@Injectable()
export class DealerPublisherRuntimeService {
  private readonly logger = new Logger(
    DealerPublisherRuntimeService.name,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly vehicles: PublisherVehicleContextService,
    private readonly events: PublisherPlatformEventService,
  ) {}

  async publish(
    context: PublisherContext,
  ): Promise<PublisherResult> {
    const vehicle =
      await this.vehicles.loadVehicle(
        this.prisma as any,
        context,
      );

    const dealers =
      await (this.prisma as any).dealer.findMany({
        where: {
          OR: [
            {
              status: "ACTIVE",
            },
            {
              status: "active",
            },
            {
              status: null,
            },
          ],
        },

        orderBy: {
          createdAt: "asc",
        },

        take: 100,
      });

    const distributions: any[] = [];

    for (const dealer of dealers) {
      if (
        vehicle.dealerId &&
        dealer.id === vehicle.dealerId
      ) {
        continue;
      }

      const event =
        await this.events.create({
          type:
            "DealerVehicleDistributionRequested",
          source:
            "publisher-engine.dealer-network",
          entityType: "dealer",
          entityId: dealer.id,
          status: "queued",

          payload: {
            dealerId: dealer.id,
            dealerName: dealer.name,
            vehicleId: vehicle.id,
            vin: vehicle.vin,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            color: vehicle.color,
            location: vehicle.location,
            price:
              this.vehicles.price(
                vehicle,
                context,
              ),
            correlationId:
              context.correlationId,
          },

          result: {
            message:
              "Vehicle queued for dealer distribution.",
          },
        });

      distributions.push({
        dealerId: dealer.id,
        dealerName: dealer.name,
        eventId: event.id,
        status: "queued",
      });
    }

    await this.prisma.auditLog.create({
      data: {
        action:
          "DEALER_NETWORK_PUBLISHED",
        entity: "Vehicle",
        entityId: vehicle.id,
      },
    });

    this.logger.log(
      `Dealer distribution created: vehicleId=${vehicle.id}, dealers=${distributions.length}`,
    );

    return {
      status: "published",
      channel: "dealer_network",
      externalId:
        `dealer-network:${vehicle.id}`,

      message:
        `Vehicle distributed to ${distributions.length} dealer(s).`,

      metadata: {
        vehicleId: vehicle.id,
        dealerCount:
          distributions.length,
        distributions,
        attempt: context.attempt,
        correlationId:
          context.correlationId,
      },
    };
  }
}
