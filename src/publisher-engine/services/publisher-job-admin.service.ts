import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PublisherJobValidator } from "../validators/publisher-job.validator";

@Injectable()
export class PublisherJobAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    const error = PublisherJobValidator.validateCreate(dto);
    if (error) return { success: false, message: error };

    const job = await (this.prisma as any).publishJob.create({
      data: {
        title: String(dto.title).trim(),
        content: dto.content ?? null,
        campaignId: dto.campaignId ?? null,
        channelId: dto.channelId ?? null,
        status: "queued",
        priority: dto.priority ?? "normal",
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        maxRetries: dto.maxRetries ?? 3,
        result: dto.result ?? {},
      },
    });

    return { success: true, job };
  }

  async createMany(items: any[]) {
    const created = [];
    for (const item of items ?? []) {
      const result = await this.create(item);
      if (result.success) created.push(result.job);
    }

    return {
      success: true,
      requested: items?.length ?? 0,
      created: created.length,
      jobs: created,
    };
  }

  async list(query: any) {
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.campaignId) where.campaignId = query.campaignId;
    if (query.priority) where.priority = query.priority;

    const limit = Math.min(Math.max(Number(query.limit ?? 50), 1), 200);

    const jobs = await (this.prisma as any).publishJob.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: limit,
    });

    return {
      success: true,
      count: jobs.length,
      jobs,
    };
  }

  async get(id: string) {
    const job = await (this.prisma as any).publishJob.findUnique({ where: { id } });
    if (!job) return { success: false, message: "PublishJob not found" };
    return { success: true, job };
  }

  async cancel(id: string) {
    const job = await (this.prisma as any).publishJob.findUnique({ where: { id } });
    if (!job) return { success: false, message: "PublishJob not found" };

    if (["published", "dead"].includes(job.status)) {
      return { success: false, message: `Cannot cancel ${job.status} job` };
    }

    const updated = await (this.prisma as any).publishJob.update({
      where: { id },
      data: {
        status: "skipped",
        lockedAt: null,
        lockToken: null,
        workerId: null,
        result: {
          ...(job.result ?? {}),
          cancellation: {
            cancelledAt: new Date().toISOString(),
            reason: "cancelled_by_api",
          },
        },
        updatedAt: new Date(),
      },
    });

    return { success: true, job: updated };
  }

  async retry(id: string) {
    const job = await (this.prisma as any).publishJob.findUnique({ where: { id } });
    if (!job) return { success: false, message: "PublishJob not found" };

    const updated = await (this.prisma as any).publishJob.update({
      where: { id },
      data: {
        status: "queued",
        failedAt: null,
        lockedAt: null,
        lockToken: null,
        workerId: null,
        lastError: null,
        updatedAt: new Date(),
      },
    });

    return { success: true, job: updated };
  }

  async retryFailed(limit = 50) {
    const jobs = await (this.prisma as any).publishJob.findMany({
      where: { status: { in: ["failed", "dead"] } },
      take: Math.min(Math.max(Number(limit) || 50, 1), 200),
      orderBy: { updatedAt: "asc" },
    });

    const updated = [];

    for (const job of jobs) {
      updated.push(await (this.prisma as any).publishJob.update({
        where: { id: job.id },
        data: {
          status: "queued",
          failedAt: null,
          lockedAt: null,
          lockToken: null,
          workerId: null,
          lastError: null,
          updatedAt: new Date(),
        },
      }));
    }

    return { success: true, retried: updated.length, jobs: updated };
  }
}
