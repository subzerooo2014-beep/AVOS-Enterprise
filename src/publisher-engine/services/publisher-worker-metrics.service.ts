import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherWorkerMetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const jobs = await (this.prisma as any).publishJob.findMany({
      take: 2000,
    });

    const workers: Record<string, any> = {};

    for (const job of jobs) {
      const worker = job.workerId ?? "unassigned";

      workers[worker] ??= {
        total: 0,
        processing: 0,
        published: 0,
        failed: 0,
      };

      workers[worker].total++;
      workers[worker][job.status] =
        (workers[worker][job.status] ?? 0) + 1;
    }

    return {
      success: true,
      workers,
      generatedAt: new Date(),
    };
  }
}
