import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { hostname } from "os";
import { PrismaService } from "../../../prisma/prisma.service";
import { AgsDistributedQueueService } from "./ags-distributed-queue.service";
import { AgsDurableWorkflowService } from "./ags-durable-workflow.service";
import { AgsTransactionalOutboxService } from "./ags-transactional-outbox.service";

@Injectable()
export class AgsDistributedWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly workerId =
    process.env.AGS_WORKER_ID ??
    "ags-worker:" + hostname() + ":" + String(process.pid);

  private timer?: NodeJS.Timeout;
  private draining = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: AgsDistributedQueueService,
    private readonly workflows: AgsDurableWorkflowService,
    private readonly outbox: AgsTransactionalOutboxService,
  ) {}

  onModuleInit() {
    if (process.env.AGS_DISTRIBUTED_WORKER_ENABLED === "false") return;

    const intervalMs = Math.max(
      Number(process.env.AGS_WORKER_POLL_MS ?? 3000),
      1000,
    );

    this.timer = setInterval(() => void this.drain(), intervalMs);
    void this.heartbeat();
    void this.queue.releaseExpiredLeases();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  heartbeat() {
    return (this.prisma as any).agsWorkerHeartbeat.upsert({
      where: { workerId: this.workerId },
      update: {
        status: "online",
        lastHeartbeat: new Date(),
        queues: ["ags-workflow", "ags-execution", "ags-outbox"],
        metadata: {
          pid: process.pid,
          hostname: hostname(),
          version: "AGS-1.1.0",
        },
      },
      create: {
        workerId: this.workerId,
        instanceId: hostname(),
        queues: ["ags-workflow", "ags-execution", "ags-outbox"],
        metadata: {
          pid: process.pid,
          hostname: hostname(),
          version: "AGS-1.1.0",
        },
      },
    });
  }

  async drain(limit = 10) {
    if (this.draining) {
      return { workerId: this.workerId, skipped: true };
    }

    this.draining = true;
    try {
      await this.heartbeat();
      await this.queue.releaseExpiredLeases();

      const jobs = (await this.queue.claim(
        this.workerId,
        "ags-workflow",
        limit,
        60,
      )) as Array<Record<string, any>>;

      const results: Array<Record<string, unknown>> = [];

      for (const job of jobs) {
        try {
          if (job.type !== "ags.workflow.execute") {
            throw new Error("Unsupported job type: " + String(job.type));
          }

          const workflowId = String(job.payload.workflowId);
          const result = await this.workflows.executeNextStep(
            workflowId,
            this.workerId,
          );

          if (!result.finished) {
            await this.queue.enqueue({
              queue: "ags-workflow",
              type: "ags.workflow.execute",
              payload: { workflowId },
              correlationId: job.correlationId,
              idempotencyKey:
                "workflow-step:" +
                workflowId +
                ":" +
                String(result.workflow.currentStep),
            });
          }

          await this.queue.complete(job.id, this.workerId, {
            workflowId,
            currentStep: result.workflow.currentStep,
            finished: result.finished,
          });

          results.push({ jobId: job.id, status: "completed" });
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          await this.queue.fail(job.id, this.workerId, message);
          results.push({ jobId: job.id, status: "failed", error: message });
        }
      }

      const messages = (await this.outbox.claim(
        this.workerId,
        limit,
        30,
      )) as Array<Record<string, any>>;

      for (const message of messages) {
        try {
          await this.outbox.markPublished(message.id, this.workerId);
        } catch (error) {
          await this.outbox.markRetry(
            message.id,
            this.workerId,
            error instanceof Error ? error.message : String(error),
          );
        }
      }

      return {
        workerId: this.workerId,
        jobsClaimed: jobs.length,
        outboxClaimed: messages.length,
        results,
      };
    } finally {
      this.draining = false;
    }
  }

  status() {
    return {
      workerId: this.workerId,
      enabled: process.env.AGS_DISTRIBUTED_WORKER_ENABLED !== "false",
      pollMs: Number(process.env.AGS_WORKER_POLL_MS ?? 3000),
      leaseBasedCoordination: true,
      multiInstanceSafe: true,
      externalBrokerAdapterBoundary: true,
    };
  }
}