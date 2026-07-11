import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const statuses = ["queued", "processing", "published", "failed", "dead", "skipped"];
    const counters: any = {};

    for (const status of statuses) {
      counters[status] = await (this.prisma as any).publishJob.count({ where: { status } });
    }

    const latest = await (this.prisma as any).publishJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const failed = await (this.prisma as any).publishJob.findMany({
      where: { status: { in: ["failed", "dead"] } },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });

    return {
      success: true,
      engine: "publisher-engine-v2",
      counters,
      latest,
      failed,
      generatedAt: new Date(),
    };
  }
}
