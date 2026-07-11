import {
  Injectable,
  Logger,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class WebsiteSitemapService {
  private readonly logger = new Logger(
    WebsiteSitemapService.name,
  );

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async requestRefresh(
    vehicleId: string,
    publicUrl: string,
    lastModified: Date,
  ): Promise<any> {
    const created =
      await (this.prisma as any).platformEvent.create({
        data: {
          id: randomUUID(),
          updatedAt: new Date(),
          type: "WebsiteSitemapRefreshRequested",
          source: "publisher-engine.website",
          entityType: "vehicle",
          entityId: vehicleId,
          status: "new",

          payload: {
            vehicleId,
            publicUrl,
            changeFrequency: "daily",
            priority: 0.8,
            lastModified:
              lastModified.toISOString(),
          },

          result: {
            message:
              "Vehicle sitemap refresh requested.",
          },
        },
      });

    this.logger.log(
      `Website sitemap refresh requested: vehicleId=${vehicleId}, eventId=${created.id}`,
    );

    return {
      eventId: created.id,
      requestedAt: created.createdAt,
    };
  }
}


