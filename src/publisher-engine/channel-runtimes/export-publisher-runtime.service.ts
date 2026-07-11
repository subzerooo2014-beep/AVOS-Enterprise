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
export class ExportPublisherRuntimeService {
  private readonly logger = new Logger(
    ExportPublisherRuntimeService.name,
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

    const exportSummary =
      context.result?.summary
        ?.exportOpportunity ??
      context.result?.exportOpportunity ??
      {};

    const targetCountries =
      Array.isArray(
        exportSummary.targetCountries,
      )
        ? exportSummary.targetCountries
        : [
            exportSummary.bestCountry ??
              "Saudi Arabia",
            "Oman",
            "Qatar",
            "Bahrain",
            "Kuwait",
          ].filter(Boolean);

    const aiScore =
      this.score(
        exportSummary.exportScore ??
        context.result?.exportScore ??
        75,
      );

    const demandScore =
      this.score(
        exportSummary.demandScore ??
        context.result?.demandScore ??
        aiScore,
      );

    const title =
      `${this.vehicles.title(
        vehicle,
      )} GCC Export Listing`;

    const existing =
      await (this.prisma as any).exportVehicle.findFirst({
        where: {
          vehicleId: vehicle.id,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    const data = {
      vehicleId: vehicle.id,
      title,
      condition:
        context.result?.condition ??
        "used",
      targetCountries,
      exportOnly: true,
      localSale: true,
      shippingReady:
        Boolean(
          context.result?.shippingReady,
        ),
      documentsReady:
        Boolean(
          context.result?.documentsReady,
        ),
      aiScore,
      demandScore,

      metadata: {
        vehicle: {
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
        },

        exportOpportunity:
          exportSummary,

        source:
          "publisher-engine.gcc-export",

        correlationId:
          context.correlationId,
      },
    };

    const exportVehicle = existing
      ? await (this.prisma as any).exportVehicle.update({
          where: {
            id: existing.id,
          },
          data,
        })
      : await (this.prisma as any).exportVehicle.create({
          data,
        });

    const event = await this.events.create({
      type:
        "GccExportVehiclePublished",
      source:
        "publisher-engine.gcc-export",
      entityType: "vehicle",
      entityId: vehicle.id,
      status: "completed",

      payload: {
        exportVehicleId:
          exportVehicle.id,
        vehicleId: vehicle.id,
        targetCountries,
        aiScore,
        demandScore,
      },

      result: {
        operation:
          existing
            ? "updated"
            : "created",
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action:
          "GCC_EXPORT_PUBLISHED",
        entity: "Vehicle",
        entityId: vehicle.id,
      },
    });

    this.logger.log(
      `GCC export published: vehicleId=${vehicle.id}, exportVehicleId=${exportVehicle.id}`,
    );

    return {
      status: "published",
      channel: "gcc_export",
      externalId:
        exportVehicle.id,

      message:
        "Vehicle published to GCC export runtime.",

      metadata: {
        vehicleId: vehicle.id,
        exportVehicleId:
          exportVehicle.id,
        operation:
          existing
            ? "updated"
            : "created",
        targetCountries,
        aiScore,
        demandScore,
        eventId: event.id,
        attempt: context.attempt,
        correlationId:
          context.correlationId,
      },
    };
  }

  private score(
    value: unknown,
  ): number {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
      return 50;
    }

    return Math.min(
      100,
      Math.max(
        0,
        Math.trunc(numeric),
      ),
    );
  }
}
