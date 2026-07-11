import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherJobReaderService {
  constructor(private readonly prisma: PrismaService) {}

  findQueued(limit = 20) {
    return (this.prisma as any).publishJob.findMany({
      where: {
        status: "queued",
        OR: [{ scheduledAt: null }, { scheduledAt: { lte: new Date() } }],
      },
      orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
      take: limit,
    });
  }

  findById(id: string) {
    return (this.prisma as any).publishJob.findUnique({ where: { id } });
  }
}
