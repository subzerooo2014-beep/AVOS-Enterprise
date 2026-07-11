import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  latest(limit = 100) {
    return (this.prisma as any).publishJob.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }

  byCampaign(campaignId: string) {
    return (this.prisma as any).publishJob.findMany({
      where: {
        campaignId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
