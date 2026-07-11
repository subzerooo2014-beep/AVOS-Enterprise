import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DistributionEngineService {
  constructor(private prisma: PrismaService) {}

  createChannel(data: any) {
    return (this.prisma as any).distributionChannel.create({
      data: {
        name: data.name,
        type: data.type || "social",
        country: data.country,
        language: data.language || "ar",
        status: data.status || "active",
        score: Number(data.score || 50),
        metadata: data.metadata || {},
      },
    });
  }

  listChannels() {
    return (this.prisma as any).distributionChannel.findMany({ orderBy: { createdAt: "desc" } });
  }

  async createPublishJob(data: any) {
    return (this.prisma as any).publishJob.create({
      data: {
        campaignId: data.campaignId,
        channelId: data.channelId,
        title: data.title,
        content: data.content,
        status: "queued",
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        result: {
          aiReason: "Publish job queued by AVOS smart distribution engine.",
        },
      },
    });
  }

  listJobs() {
    return (this.prisma as any).publishJob.findMany({ orderBy: { createdAt: "desc" } });
  }

  async markPublished(id: string, result: any = {}) {
    const job = await (this.prisma as any).publishJob.findUnique({ where: { id } });
    if (!job) throw new NotFoundException("Publish job not found");

    return (this.prisma as any).publishJob.update({
      where: { id },
      data: {
        status: "published",
        publishedAt: new Date(),
        result: {
          ...(job.result || {}),
          ...result,
          aiNextAction: "Monitor engagement and republish if performance drops.",
        },
      },
    });
  }

  async autoRepublish(id: string, metrics: any = {}) {
    const job = await (this.prisma as any).publishJob.findUnique({ where: { id } });
    if (!job) throw new NotFoundException("Publish job not found");

    const weak = metrics.views < 100 || metrics.leads < 3 || metrics.weakEngagement === true;

    return (this.prisma as any).publishJob.create({
      data: {
        campaignId: job.campaignId,
        channelId: job.channelId,
        title: weak ? `${job.title} - AI Optimized` : job.title,
        content: job.content,
        status: weak ? "queued" : "skipped",
        scheduledAt: weak ? new Date(Date.now() + 60 * 60 * 1000) : null,
        result: {
          previousJobId: id,
          metrics,
          aiReason: weak
            ? "Engagement was weak, AI scheduled a republish."
            : "Performance is acceptable, republish skipped.",
        },
      },
    });
  }
}
