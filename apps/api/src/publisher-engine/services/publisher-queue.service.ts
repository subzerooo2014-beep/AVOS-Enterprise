import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherQueueService {
  constructor(private readonly prisma: PrismaService) {}

  queued(limit = 50) {
    return (this.prisma as any).publishJob.findMany({
      where: { status: "queued" },
      orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
      take: limit,
    });
  }

  processing(limit = 50) {
    return (this.prisma as any).publishJob.findMany({
      where: { status: "processing" },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
  }

  failed(limit = 50) {
    return (this.prisma as any).publishJob.findMany({
      where: { status: { in: ["failed","dead"] } },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
  }
}
