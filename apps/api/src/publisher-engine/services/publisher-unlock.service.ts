import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherUnlockService {
  constructor(private readonly prisma: PrismaService) {}

  async unlockExpired(minutes = 10) {
    const threshold = new Date(Date.now() - Number(minutes) * 60 * 1000);

    const jobs = await (this.prisma as any).publishJob.findMany({
      where: {
        status: "processing",
        lockedAt: { lt: threshold },
      },
      take: 100,
    });

    const unlocked = [];

    for (const job of jobs) {
      unlocked.push(await (this.prisma as any).publishJob.update({
        where: { id: job.id },
        data: {
          status: "queued",
          lockedAt: null,
          lockToken: null,
          workerId: null,
          lastError: "Auto-unlocked expired processing job",
          updatedAt: new Date(),
        },
      }));
    }

    return {
      success: true,
      unlocked: unlocked.length,
      jobs: unlocked,
    };
  }
}
