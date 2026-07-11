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
export class CrmPublisherRuntimeService {
  private readonly logger = new Logger(
    CrmPublisherRuntimeService.name,
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

    const vehicleTitle =
      this.vehicles.title(vehicle);

    const source =
      `publisher:crm_leads:vehicle:${vehicle.id}`;

    const existing =
      await (this.prisma as any).lead.findFirst({
        where: {
          source,
          status: {
            in: [
              "NEW",
              "OPEN",
              "CONTACTED",
              "QUALIFIED",
            ],
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    const lead = existing
      ? await (this.prisma as any).lead.update({
          where: {
            id: existing.id,
          },

          data: {
            name:
              `Vehicle interest: ${vehicleTitle}`,
            status: "NEW",
            source,
          },
        })
      : await (this.prisma as any).lead.create({
          data: {
            name:
              `Vehicle interest: ${vehicleTitle}`,
            phone: null,
            source,
            status: "NEW",
          },
        });

    const event = await this.events.create({
      type: "CrmLeadPublished",
      source:
        "publisher-engine.crm-leads",
      entityType: "vehicle",
      entityId: vehicle.id,
      status: "completed",

      payload: {
        vehicleId: vehicle.id,
        leadId: lead.id,
        title: vehicleTitle,
        price:
          this.vehicles.price(
            vehicle,
            context,
          ),
        channel: "crm_leads",
        correlationId:
          context.correlationId,
      },

      result: {
        operation:
          existing
            ? "updated"
            : "created",
        leadId: lead.id,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action:
          "CRM_LEAD_PUBLISHED",
        entity: "Vehicle",
        entityId: vehicle.id,
      },
    });

    this.logger.log(
      `CRM lead published: vehicleId=${vehicle.id}, leadId=${lead.id}`,
    );

    return {
      status: "published",
      channel: "crm_leads",
      externalId: lead.id,
      message:
        "Vehicle published to AVOS CRM leads.",

      metadata: {
        vehicleId: vehicle.id,
        leadId: lead.id,
        operation:
          existing
            ? "updated"
            : "created",
        source,
        eventId: event.id,
        attempt: context.attempt,
        correlationId:
          context.correlationId,
      },
    };
  }
}
