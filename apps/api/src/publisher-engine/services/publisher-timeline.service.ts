import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherTimelineService {
  constructor(private readonly prisma: PrismaService) {}

  async timeline(limit = 100) {
    const events = await (this.prisma as any).platformEvent.findMany({
      where: {
        source: "publisher-engine",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return {
      success: true,
      events,
    };
  }
}
