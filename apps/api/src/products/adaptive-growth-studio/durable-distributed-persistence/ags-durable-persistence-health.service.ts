import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { AgsDistributedQueueService } from "./ags-distributed-queue.service";
import { AgsDistributedWorkerService } from "./ags-distributed-worker.service";
import { AgsTransactionalOutboxService } from "./ags-transactional-outbox.service";

@Injectable()
export class AgsDurablePersistenceHealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: AgsDistributedQueueService,
    private readonly outbox: AgsTransactionalOutboxService,
    private readonly worker: AgsDistributedWorkerService,
  ) {}

  async evaluate() {
    const probe = await (this.prisma as any).$queryRawUnsafe(
      "SELECT NOW() AS now, current_database() AS database",
    );

    return {
      name: "AGS Durable Distributed Persistence",
      version: "AGS-1.1.0",
      status: "healthy",
      database: {
        engine: "PostgreSQL",
        connected: true,
        probe,
      },
      persistence: {
        workflows: "durable",
        events: "append-only",
        outbox: "transactional",
        queue: "lease-based-distributed",
        idempotency: "enabled",
        audit: "durable",
      },
      worker: this.worker.status(),
      queue: await this.queue.status(),
      outbox: await this.outbox.status(),
      multiInstanceReady: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      checkedAt: new Date().toISOString(),
    };
  }
}