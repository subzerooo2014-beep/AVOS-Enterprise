import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AiActionLogService } from "../ai-action-log/ai-action-log.service";

@Injectable()
export class AiDistributionEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logs: AiActionLogService,
  ) {}

  async dashboard() {
    const jobs = await (this.prisma as any).publishJob.findMany({
      orderBy: { createdAt: "desc" },
    });

    const summary = {
      total: jobs.length,
      queued: jobs.filter((j: any) => j.status === "queued").length,
      published: jobs.filter((j: any) => j.status === "published").length,
      failed: jobs.filter((j: any) => j.status === "failed").length,
      channels: this.groupByChannel(jobs),
    };

    return {
      success: true,
      summary,
      latest: jobs.slice(0, 20),
    };
  }

  async processQueued(limit = 20) {
    const jobs = await (this.prisma as any).publishJob.findMany({
      where: { status: "queued" },
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    const processed: any[] = [];

    for (const job of jobs) {
      const channel = this.channelOf(job);
      const entityId = this.entityIdOf(job);

      const result = this.simulatePublish(job, channel);

      const updated = await (this.prisma as any).publishJob.update({
        where: { id: job.id },
        data: {
          status: result.ok ? "published" : "failed",
          publishedAt: result.ok ? new Date() : null,
          result: {
            ...(job.result ?? {}),
            distribution: result,
            processedBy: "AI_DISTRIBUTION_ENGINE_V1",
          },
          updatedAt: new Date(),
        },
      });

      if (entityId) {
        await this.logs.write(
          entityId,
          result.ok ? `DISTRIBUTED:${channel}` : `DISTRIBUTION_FAILED:${channel}`,
          result.ok ? "completed" : "failed",
        );
      }

      processed.push(updated);
    }

    return {
      success: true,
      processedCount: processed.length,
      processed,
    };
  }

  async retryFailed(limit = 20) {
    const jobs = await (this.prisma as any).publishJob.findMany({
      where: { status: "failed" },
      orderBy: { updatedAt: "asc" },
      take: limit,
    });

    const retried = [];

    for (const job of jobs) {
      retried.push(await (this.prisma as any).publishJob.update({
        where: { id: job.id },
        data: {
          status: "queued",
          result: {
            ...(job.result ?? {}),
            retry: {
              at: new Date().toISOString(),
              by: "AI_DISTRIBUTION_ENGINE_V1",
            },
          },
          updatedAt: new Date(),
        },
      }));
    }

    return {
      success: true,
      retriedCount: retried.length,
      retried,
    };
  }

  async channelReport(channel: string) {
    const jobs = await (this.prisma as any).publishJob.findMany({
      where: {
        OR: [
          { title: { contains: channel } },
          { content: { contains: channel } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      channel,
      total: jobs.length,
      queued: jobs.filter((j: any) => j.status === "queued").length,
      published: jobs.filter((j: any) => j.status === "published").length,
      failed: jobs.filter((j: any) => j.status === "failed").length,
      jobs,
    };
  }

  async vehicleReport(vehicleId: string) {
    const jobs = await (this.prisma as any).publishJob.findMany({
      where: {
        OR: [
          { content: { contains: vehicleId } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      vehicleId,
      total: jobs.length,
      queued: jobs.filter((j: any) => j.status === "queued").length,
      published: jobs.filter((j: any) => j.status === "published").length,
      failed: jobs.filter((j: any) => j.status === "failed").length,
      channels: this.groupByChannel(jobs),
      jobs,
    };
  }

  private simulatePublish(job: any, channel: string) {
    const reliableChannels = [
      "website",
      "crm_leads",
      "matched_buyers",
      "dealer_network",
      "gcc_export",
      "instagram",
      "tiktok",
      "google_search",
    ];

    const ok = reliableChannels.includes(channel);

    return {
      ok,
      channel,
      externalId: ok ? `AVOS-${channel}-${job.id}` : null,
      message: ok ? "Published successfully by simulated adapter." : "Unsupported channel.",
      publishedAt: ok ? new Date().toISOString() : null,
    };
  }

  private channelOf(job: any) {
    const result = job.result ?? {};
    if (result.channel) return result.channel;

    const title = String(job.title ?? "").toLowerCase();

    const known = [
      "website",
      "instagram",
      "tiktok",
      "google_search",
      "matched_buyers",
      "crm_leads",
      "gcc_export",
      "dealer_network",
    ];

    return known.find((c) => title.includes(c)) ?? "internal";
  }

  private entityIdOf(job: any) {
    const result = job.result ?? {};
    if (result.entityId) return result.entityId;

    const content = String(job.content ?? "");
    const match = content.match(/cmr[a-z0-9]+/i);
    return match ? match[0] : null;
  }

  private groupByChannel(jobs: any[]) {
    const map: Record<string, number> = {};
    for (const job of jobs) {
      const channel = this.channelOf(job);
      map[channel] = (map[channel] ?? 0) + 1;
    }
    return map;
  }
}
