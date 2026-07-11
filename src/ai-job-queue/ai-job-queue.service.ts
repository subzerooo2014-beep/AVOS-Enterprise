import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export type JobStatus = "queued" | "running" | "completed" | "failed" | "dead";

@Injectable()
export class AiJobQueueService {
  constructor(private readonly prisma: PrismaService) {}

  async enqueue(type: string, payload: any, priority = 50) {
    return (this.prisma as any).aiActionLog.create({
      data: {
        id: crypto.randomUUID(),
        entityType: "job",
        entityId: payload?.entityId ?? "system",
        action: type,
        status: "queued",
      },
    });
  }

  async queued(limit = 20) {
    const jobs = await (this.prisma as any).aiActionLog.findMany({
      where: {
        entityType: "job",
        status: "queued",
      },
      orderBy: {
        createdAt: "asc",
      },
      take: limit,
    });

    return jobs.sort((a: any, b: any) => this.priorityOf(b) - this.priorityOf(a));
  }

  async failed(limit = 20) {
    return (this.prisma as any).aiActionLog.findMany({
      where: {
        entityType: "job",
        status: "failed",
      },
      orderBy: {
        createdAt: "asc",
      },
      take: limit,
    });
  }

  async mark(id: string, status: JobStatus) {
    return (this.prisma as any).aiActionLog.update({
      where: { id },
      data: { status },
    });
  }

  async retryFailed(limit = 20) {
    const jobs = await this.failed(limit);
    const retried = [];

    for (const job of jobs) {
      retried.push(await this.mark(job.id, "queued"));
    }

    return {
      success: true,
      retriedCount: retried.length,
      retried,
    };
  }

  async moveFailedToDead(limit = 20) {
    const jobs = await this.failed(limit);
    const dead = [];

    for (const job of jobs) {
      dead.push(await this.mark(job.id, "dead"));
    }

    return {
      success: true,
      deadCount: dead.length,
      dead,
    };
  }

  async cleanupCompleted(limit = 100) {
    const completed = await (this.prisma as any).aiActionLog.findMany({
      where: {
        entityType: "job",
        status: "completed",
      },
      orderBy: {
        createdAt: "asc",
      },
      take: limit,
    });

    for (const job of completed) {
      await (this.prisma as any).aiActionLog.delete({
        where: { id: job.id },
      });
    }

    return {
      success: true,
      deleted: completed.length,
    };
  }

  async dashboard() {
    const jobs = await (this.prisma as any).aiActionLog.findMany({
      where: { entityType: "job" },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      total: jobs.length,
      queued: jobs.filter((j: any) => j.status === "queued").length,
      running: jobs.filter((j: any) => j.status === "running").length,
      completed: jobs.filter((j: any) => j.status === "completed").length,
      failed: jobs.filter((j: any) => j.status === "failed").length,
      dead: jobs.filter((j: any) => j.status === "dead").length,
      byType: this.groupBy(jobs, "action"),
      workerHealth: {
        mode: "in-process",
        status: "active",
        maxBatch: 5,
        autoTickMs: 3000,
      },
      latest: jobs.slice(0, 50),
    };
  }

  private priorityOf(job: any) {
    const action = String(job.action ?? "");
    if (action.includes("URGENT")) return 100;
    if (action.includes("PUBLISH")) return 80;
    if (action.includes("CAMPAIGN")) return 70;
    if (action.includes("ANALYTICS")) return 40;
    return 50;
  }

  private groupBy(items: any[], key: string) {
    const map: Record<string, number> = {};
    for (const item of items) {
      const value = item[key] ?? "unknown";
      map[value] = (map[value] ?? 0) + 1;
    }
    return map;
  }
}
