import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherCleanupService {
  constructor(private readonly prisma: PrismaService) {}

  async removeSkipped(days = 30) {
    const before = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000,
    );

    const jobs = await (this.prisma as any).publishJob.findMany({
      where: {
        status: "skipped",
        updatedAt: { lt: before },
      },
    });

    for (const job of jobs) {
      await (this.prisma as any).publishJob.delete({
        where: { id: job.id },
      });
    }

    return {
      success: true,
      removed: jobs.length,
    };
  }
}
