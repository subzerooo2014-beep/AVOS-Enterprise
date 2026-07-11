import {
  Injectable,
  Logger,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class WebsiteSearchIndexService {
  private readonly logger = new Logger(
    WebsiteSearchIndexService.name,
  );

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async upsert(
    vehicle: any,
    document: any,
  ): Promise<any> {
    const existing =
      await (this.prisma as any).platformEvent.findFirst({
        where: {
          type: "WebsiteVehicleIndexRequested",
          entityType: "vehicle",
          entityId: vehicle.id,
          status: {
            in: ["new", "queued"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (existing) {
      const updated =
        await (this.prisma as any).platformEvent.update({
          where: {
            id: existing.id,
          },
          data: {
            updatedAt: new Date(),
            source: "publisher-engine.website",
            status: "new",
            payload: document,
            result: {
              message:
                "Website vehicle search index event refreshed.",
            },
          },
        });

      return {
        operation: "refreshed",
        eventId: updated.id,
      };
    }

    const created =
      await (this.prisma as any).platformEvent.create({
        data: {
          id: randomUUID(),
          updatedAt: new Date(),
          type: "WebsiteVehicleIndexRequested",
          source: "publisher-engine.website",
          entityType: "vehicle",
          entityId: vehicle.id,
          status: "new",
          payload: document,
          result: {
            message:
              "Website vehicle search index event created.",
          },
        },
      });

    this.logger.log(
      `Website search indexing requested: vehicleId=${vehicle.id}, eventId=${created.id}`,
    );

    return {
      operation: "created",
      eventId: created.id,
    };
  }
}


