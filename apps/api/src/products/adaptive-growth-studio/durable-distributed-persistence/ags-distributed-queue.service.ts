import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { AgsDurableIdService } from "./ags-durable-id.service";
import { AgsEnqueueJob } from "./ags-durable.contracts";

@Injectable()
export class AgsDistributedQueueService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ids: AgsDurableIdService,
  ) {}

  async enqueue(input: AgsEnqueueJob) {
    if (input.idempotencyKey) {
      const existing = await (this.prisma as any).agsDistributedJob.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (existing) return existing;
    }

    return (this.prisma as any).agsDistributedJob.create({
      data: {
        id: this.ids.create("ags-job"),
        queue: input.queue ?? "ags-execution",
        type: input.type,
        payload: input.payload,
        priority: input.priority ?? 100,
        maxAttempts: input.maxAttempts ?? 5,
        availableAt: input.availableAt ? new Date(input.availableAt) : new Date(),
        idempotencyKey: input.idempotencyKey,
        correlationId: input.correlationId,
      },
    });
  }

  claim(workerId: string, queue = "ags-execution", limit = 10, leaseSeconds = 60) {
    const sql = [
      "WITH candidates AS (",
      '  SELECT id FROM "ags_distributed_jobs"',
      "  WHERE queue = $1",
      "    AND status IN ('queued', 'retry')",
      '    AND "availableAt" <= NOW()',
      '    AND ("leaseExpiresAt" IS NULL OR "leaseExpiresAt" < NOW())',
      '  ORDER BY priority ASC, "availableAt" ASC, "createdAt" ASC',
      "  FOR UPDATE SKIP LOCKED",
      "  LIMIT $2",
      ")",
      'UPDATE "ags_distributed_jobs" j',
      "SET status = 'processing',",
      '    "leaseOwner" = $3,',
      '    "leaseExpiresAt" = NOW() + ($4 * INTERVAL \'1 second\'),',
      "    attempts = attempts + 1,",
      '    "updatedAt" = NOW()',
      "FROM candidates c",
      "WHERE j.id = c.id",
      'RETURNING j.id, j.queue, j.type, j.payload, j.attempts,',
      '          j."maxAttempts", j."correlationId", j."leaseOwner", j."leaseExpiresAt"',
    ].join("\n");

    return (this.prisma as any).$queryRawUnsafe(
      sql,
      queue,
      Math.min(Math.max(limit, 1), 100),
      workerId,
      Math.min(Math.max(leaseSeconds, 10), 600),
    );
  }

  complete(id: string, workerId: string, result: Record<string, unknown>) {
    return (this.prisma as any).agsDistributedJob.updateMany({
      where: { id, leaseOwner: workerId, status: "processing" },
      data: {
        status: "completed",
        result,
        completedAt: new Date(),
        leaseOwner: null,
        leaseExpiresAt: null,
      },
    });
  }

  async fail(id: string, workerId: string, error: string) {
    const job = await (this.prisma as any).agsDistributedJob.findUnique({
      where: { id },
    });
    if (!job) return null;

    const terminal = job.attempts >= job.maxAttempts;
    return (this.prisma as any).agsDistributedJob.updateMany({
      where: { id, leaseOwner: workerId, status: "processing" },
      data: {
        status: terminal ? "dead-letter" : "retry",
        failedAt: terminal ? new Date() : null,
        lastError: error.slice(0, 4000),
        availableAt: new Date(Date.now() + Math.min(300000, 1000 * 2 ** job.attempts)),
        leaseOwner: null,
        leaseExpiresAt: null,
      },
    });
  }

  async releaseExpiredLeases() {
    const now = new Date();
    const jobs = await (this.prisma as any).agsDistributedJob.updateMany({
      where: { status: "processing", leaseExpiresAt: { lt: now } },
      data: {
        status: "retry",
        leaseOwner: null,
        leaseExpiresAt: null,
        availableAt: now,
        lastError: "Worker lease expired; recovered automatically.",
      },
    });

    const outbox = await (this.prisma as any).agsOutboxMessage.updateMany({
      where: { status: "processing", leaseExpiresAt: { lt: now } },
      data: {
        status: "retry",
        leaseOwner: null,
        leaseExpiresAt: null,
        availableAt: now,
        lastError: "Publisher lease expired; recovered automatically.",
      },
    });

    return { jobs: jobs.count, outbox: outbox.count };
  }

  status() {
    return (this.prisma as any).agsDistributedJob.groupBy({
      by: ["queue", "status"],
      _count: { _all: true },
    });
  }
}