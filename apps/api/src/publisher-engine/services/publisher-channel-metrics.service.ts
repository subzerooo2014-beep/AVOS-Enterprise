import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherChannelMetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const jobs = await (this.prisma as any).publishJob.findMany({
      take: 2000,
      orderBy: { createdAt: "desc" },
    });

    const channels: Record<string, any> = {};

    for (const job of jobs) {
      const channel =
        job?.result?.publisher?.channel ??
        job?.result?.channel ??
        "internal";

      channels[channel] ??= {
        total: 0,
        published: 0,
        failed: 0,
        queued: 0,
        processing: 0,
        skipped: 0,
        dead: 0,
      };

      channels[channel].total++;
      channels[channel][job.status] =
        (channels[channel][job.status] ?? 0) + 1;
    }

    return {
      success: true,
      channels,
      generatedAt: new Date(),
    };
  }
}
