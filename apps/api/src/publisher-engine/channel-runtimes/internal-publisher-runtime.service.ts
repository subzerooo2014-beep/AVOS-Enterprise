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
export class InternalPublisherRuntimeService {
  private readonly logger = new Logger(
    InternalPublisherRuntimeService.name,
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

    const event = await this.events.create({
      type:
        "InternalVehiclePublicationCompleted",
      source:
        "publisher-engine.internal",
      entityType: "vehicle",
      entityId: vehicle.id,
      status: "completed",

      payload: {
        vehicleId: vehicle.id,
        vin: vehicle.vin,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        status: vehicle.status,
        location: vehicle.location,
        price:
          this.vehicles.price(
            vehicle,
            context,
          ),
        publicationResult:
          context.result,
        correlationId:
          context.correlationId,
      },

      result: {
        analyticsRefresh: true,
        searchRefresh: true,
        aiFeedbackRequested: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action:
          "INTERNAL_VEHICLE_PUBLISHED",
        entity: "Vehicle",
        entityId: vehicle.id,
      },
    });

    this.logger.log(
      `Internal publication completed: vehicleId=${vehicle.id}, eventId=${event.id}`,
    );

    return {
      status: "published",
      channel: "internal",
      externalId: event.id,
      message:
        "Vehicle published to AVOS internal runtime.",

      metadata: {
        vehicleId: vehicle.id,
        eventId: event.id,
        analyticsRefresh: true,
        searchRefresh: true,
        aiFeedbackRequested: true,
        attempt: context.attempt,
        correlationId:
          context.correlationId,
      },
    };
  }
}
