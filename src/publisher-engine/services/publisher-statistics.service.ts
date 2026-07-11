import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherStatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const statuses = [
      "queued",
      "processing",
      "published",
      "failed",
      "dead",
      "skipped",
    ];

    const result: any = {};

    for (const status of statuses) {
      result[status] = await (this.prisma as any).publishJob.count({
        where: { status },
      });
    }

    return {
      success: true,
      statistics: result,
      generatedAt: new Date(),
    };
  }
}
