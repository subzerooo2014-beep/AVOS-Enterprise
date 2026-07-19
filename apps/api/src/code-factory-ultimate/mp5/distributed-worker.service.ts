import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { DurableJobQueueService } from "./durable-job-queue.service";
import { WorkerRecord } from "../types/ultimate.types";
import { JsonFileStoreService } from "../infrastructure/json-file-store.service";

@Injectable()
export class DistributedWorkerService implements OnModuleInit, OnModuleDestroy {
  private timer?: NodeJS.Timeout;
  private readonly worker: WorkerRecord = { id: `worker:${process.pid}`, name: `local-worker-${process.pid}`, status: "idle", supportedTypes: ["factory.echo", "factory.health"], processed: 0, failed: 0, lastHeartbeatAt: new Date().toISOString() };
  constructor(private readonly queue: DurableJobQueueService, private readonly store: JsonFileStoreService) {}
  async onModuleInit(): Promise<void> { await this.persist(); this.timer = setInterval(() => void this.tick(), 1000); this.timer.unref(); }
  async onModuleDestroy(): Promise<void> { if (this.timer) clearInterval(this.timer); this.worker.status="stopped"; await this.persist(); }
  async tick(): Promise<void> {
    if (this.worker.status === "working") return;
    this.worker.lastHeartbeatAt = new Date().toISOString();
    const job = await this.queue.lease(this.worker.id, this.worker.supportedTypes);
    if (!job) { this.worker.status="idle"; await this.persist(); return; }
    this.worker.status="working"; this.worker.activeJobId=job.id; await this.persist();
    try {
      await this.queue.markRunning(job.id);
      const result = job.type === "factory.health" ? { healthy: true, workerId: this.worker.id } : { echoed: job.payload, workerId: this.worker.id };
      await this.queue.complete(job.id, result); this.worker.processed++;
    } catch (error) { await this.queue.fail(job.id, error instanceof Error ? error.message : String(error)); this.worker.failed++; }
    finally { this.worker.status="idle"; delete this.worker.activeJobId; this.worker.lastHeartbeatAt=new Date().toISOString(); await this.persist(); }
  }
  async status(): Promise<WorkerRecord> { return { ...this.worker }; }
  private async persist(): Promise<void> { await this.store.writeJson(this.store.path("workers", `${this.worker.id}.json`), this.worker); }
}
