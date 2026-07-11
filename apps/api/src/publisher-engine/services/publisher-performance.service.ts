import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherPerformanceService {
  constructor(private readonly prisma: PrismaService) {}

  async report() {
    const jobs = await (this.prisma as any).publishJob.findMany({
      take: 1000,
    });

    let execution = 0;
    let counted = 0;

    for (const job of jobs) {
      const ms = job?.result?.execution?.executionMs;

      if (typeof ms === "number") {
        execution += ms;
        counted++;
      }
    }

    return {
      success: true,
      totalJobs: jobs.length,
      measuredJobs: counted,
      averageExecutionMs: counted ? Math.round(execution / counted) : 0,
      generatedAt: new Date(),
    };
  }
}
