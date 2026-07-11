import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AiRuntimeService } from "../ai-runtime/ai-runtime.service";

@Injectable()
export class AvosBrainService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiRuntime: AiRuntimeService,
  ) {}

  private async processTask(task: any) {
    try {
      const result = await this.aiRuntime.run(task.taskType, task.input || {});

      return (this.prisma as any).brainTask.update({
        where: { id: task.id },
        data: {
          status: result.status === "success" ? "completed" : "failed",
          output: {
            agentStatus: result.status,
            confidence: result.confidence || 0,
            reason: result.reason,
            result: result.output,
            processedAt: new Date().toISOString(),
          },
        },
      });
    } catch (error: unknown) {
      return (this.prisma as any).brainTask.update({
        where: { id: task.id },
        data: {
          status: "failed",
          output: {
            error: error instanceof Error ? error.message : String(error),
            failedAt: new Date().toISOString(),
          },
        },
      });
    }
  }

  async processQueued(limit = 20) {
    const tasks = await (this.prisma as any).brainTask.findMany({
      where: { status: "queued" },
      orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
      take: Number(limit),
    });

    const results = [];

    for (const task of tasks) {
      results.push(await this.processTask(task));
    }

    return {
      processed: results.length,
      results,
    };
  }

  async processEvent(eventId: string) {
    const event = await (this.prisma as any).platformEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException("Platform event not found");

    return this.processQueued(20);
  }

  async processLatest(limit = 10) {
    return this.processQueued(limit);
  }

  listTasks(status?: string) {
    return (this.prisma as any).brainTask.findMany({
      where: status ? { status } : {},
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    });
  }

  async completeTask(id: string, output: any = {}) {
    const task = await (this.prisma as any).brainTask.findUnique({
      where: { id },
    });

    if (!task) throw new NotFoundException("Brain task not found");

    return (this.prisma as any).brainTask.update({
      where: { id },
      data: {
        status: "completed",
        output: {
          ...(task.output || {}),
          ...output,
          completedAt: new Date().toISOString(),
        },
      },
    });
  }
}
