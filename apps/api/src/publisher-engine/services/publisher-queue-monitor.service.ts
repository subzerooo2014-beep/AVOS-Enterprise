import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

type QueueCounters = {
  queued: number;
  processing: number;
  published: number;
  failed: number;
  dead: number;
  skipped: number;
};

@Injectable()
export class PublisherQueueMonitorService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const jobs = await (this.prisma as any).publishJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const queue: QueueCounters = {
      queued: 0,
      processing: 0,
      published: 0,
      failed: 0,
      dead: 0,
      skipped: 0,
    };

    for (const job of jobs) {
      const status = String(job.status) as keyof QueueCounters;

      if (status in queue) {
        queue[status]++;
      }
    }

    return {
      success: true,
      queue,
      total: jobs.length,
      generatedAt: new Date(),
    };
  }
}
