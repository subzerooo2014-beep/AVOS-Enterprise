import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherPriorityQueueService {
  constructor(private readonly prisma: PrismaService) {}

  next(limit = 50) {
    return (this.prisma as any).publishJob.findMany({
      where: {
        status: "queued",
      },
      orderBy: [
        { priority: "asc" },
        { createdAt: "asc" },
      ],
      take: limit,
    });
  }
}
