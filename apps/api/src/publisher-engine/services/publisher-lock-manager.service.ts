import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PublisherLockUtil } from "../utils/publisher-lock.util";

@Injectable()
export class PublisherLockManagerService {
  constructor(private readonly prisma: PrismaService) {}

  async releaseExpired(minutes = 10) {
    const jobs = await (this.prisma as any).publishJob.findMany({
      where: {
        status: "processing",
      },
      take: 500,
    });

    let released = 0;

    for (const job of jobs) {
      if (!PublisherLockUtil.expired(job.lockedAt, minutes)) continue;

      await (this.prisma as any).publishJob.update({
        where: { id: job.id },
        data: {
          status: "queued",
          lockedAt: null,
          lockToken: null,
          workerId: null,
          updatedAt: new Date(),
        },
      });

      released++;
    }

    return {
      success: true,
      released,
    };
  }
}
