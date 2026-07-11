import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherRetryService {
  constructor(private readonly prisma: PrismaService) {}

  async retryable(limit = 100) {
    return (this.prisma as any).publishJob.findMany({
      where: {
        status: "failed",
      },
      orderBy: {
        updatedAt: "asc",
      },
      take: limit,
    });
  }

  async enqueue(job: any) {
    return (this.prisma as any).publishJob.update({
      where: { id: job.id },
      data: {
        status: "queued",
        retryCount: Number(job.retryCount ?? 0) + 1,
        lockedAt: null,
        lockToken: null,
        workerId: null,
        updatedAt: new Date(),
      },
    });
  }
}
