import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async byChannel() {
    const jobs = await (this.prisma as any).publishJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const stats: Record<string, any> = {};

    for (const job of jobs) {
      const result = job.result ?? {};
      const channel = result.channel ?? result.publisher?.channel ?? "internal";
      stats[channel] ??= { total: 0, published: 0, failed: 0, queued: 0, dead: 0 };
      stats[channel].total++;
      stats[channel][job.status] = (stats[channel][job.status] ?? 0) + 1;
    }

    return { success: true, channels: stats };
  }
}
