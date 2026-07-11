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
export class BuyerMatchingRuntimeService {
  private readonly logger = new Logger(
    BuyerMatchingRuntimeService.name,
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

    const activeLeads =
      await (this.prisma as any).lead.findMany({
        where: {
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

        take: 100,
      });

    const vehicleTerms = [
      vehicle.make,
      vehicle.model,
      vehicle.year,
      vehicle.color,
      vehicle.location,
    ]
      .filter(Boolean)
      .map((value) =>
        String(value).toLowerCase(),
      );

    const matches = activeLeads
      .map((lead: any) => {
        const text = [
          lead.name,
          lead.source,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchedTerms =
          vehicleTerms.filter((term) =>
            text.includes(term),
          );

        const score = Math.min(
          100,
          40 +
            matchedTerms.length * 15 +
            (
              lead.phone
                ? 10
                : 0
            ),
        );

        return {
          leadId: lead.id,
          name: lead.name,
          phone: lead.phone,
          source: lead.source,
          score,
          matchedTerms,
        };
      })
      .filter(
        (match: any) =>
          match.score >= 55,
      )
      .sort(
        (a: any, b: any) =>
          b.score - a.score,
      )
      .slice(0, 25);

    const event = await this.events.create({
      type:
        "VehicleBuyerMatchingCompleted",
      source:
        "publisher-engine.matched-buyers",
      entityType: "vehicle",
      entityId: vehicle.id,
      status: "completed",

      payload: {
        vehicleId: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        price:
          this.vehicles.price(
            vehicle,
            context,
          ),
        totalLeadsChecked:
          activeLeads.length,
      },

      result: {
        matchCount: matches.length,
        matches,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action:
          "BUYER_MATCHING_PUBLISHED",
        entity: "Vehicle",
        entityId: vehicle.id,
      },
    });

    this.logger.log(
      `Buyer matching completed: vehicleId=${vehicle.id}, matches=${matches.length}`,
    );

    return {
      status: "published",
      channel: "matched_buyers",
      externalId:
        `buyer-matches:${event.id}`,

      message:
        `Buyer matching completed with ${matches.length} match(es).`,

      metadata: {
        vehicleId: vehicle.id,
        eventId: event.id,
        totalLeadsChecked:
          activeLeads.length,
        matchCount: matches.length,
        matches,
        attempt: context.attempt,
        correlationId:
          context.correlationId,
      },
    };
  }
}
