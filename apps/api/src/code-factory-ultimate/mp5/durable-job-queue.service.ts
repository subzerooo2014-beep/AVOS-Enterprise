import { Injectable, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DurableJob } from "../types/ultimate.types";
import { JsonFileStoreService } from "../infrastructure/json-file-store.service";

@Injectable()
export class DurableJobQueueService implements OnModuleInit {
  private readonly locks = new Set<string>();
  constructor(private readonly store: JsonFileStoreService) {}
  async onModuleInit(): Promise<void> { await this.store.initialize(); await this.recoverExpiredLeases(); }
  private jobPath(id: string): string { return this.store.path("jobs", `${id}.json`); }

  async enqueue(type: string, payload: Record<string, unknown>, options: { priority?: number; maxAttempts?: number; delayMs?: number } = {}): Promise<DurableJob> {
    const now = new Date();
    const job: DurableJob = {
      id: `job:${Date.now()}:${randomUUID()}`, type, status: "queued", priority: options.priority ?? 50,
      payload, attempts: 0, maxAttempts: options.maxAttempts ?? 3,
      availableAt: new Date(now.getTime() + (options.delayMs ?? 0)).toISOString(),
      createdAt: now.toISOString(), updatedAt: now.toISOString(), traceId: randomUUID(),
    };
    await this.store.writeJson(this.jobPath(job.id), job);
    return job;
  }

  async list(status?: string): Promise<DurableJob[]> {
    const jobs = await this.store.listJson<DurableJob>(this.store.path("jobs"));
    return jobs.filter((j) => !status || j.status === status).sort((a,b) => b.priority - a.priority || a.createdAt.localeCompare(b.createdAt));
  }

  async get(id: string): Promise<DurableJob | undefined> { return this.store.readJson<DurableJob>(this.jobPath(id)); }

  async lease(workerId: string, supportedTypes: string[], leaseMs = 30000): Promise<DurableJob | undefined> {
    const now = Date.now();
    const candidates = (await this.list("queued")).filter((job) => supportedTypes.includes("*") || supportedTypes.includes(job.type)).filter((job) => Date.parse(job.availableAt) <= now);
    for (const candidate of candidates) {
      if (this.locks.has(candidate.id)) continue;
      this.locks.add(candidate.id);
      try {
        const current = await this.get(candidate.id);
        if (!current || current.status !== "queued") continue;
        current.status = "leased"; current.leaseOwner = workerId; current.leaseExpiresAt = new Date(now + leaseMs).toISOString(); current.updatedAt = new Date().toISOString();
        await this.store.writeJson(this.jobPath(current.id), current);
        return current;
      } finally { this.locks.delete(candidate.id); }
    }
    return undefined;
  }

  async markRunning(id: string): Promise<DurableJob> { return this.mutate(id, (job) => { job.status = "running"; job.attempts += 1; }); }
  async complete(id: string, result: Record<string, unknown>): Promise<DurableJob> { return this.mutate(id, (job) => { job.status="completed"; job.result=result; job.completedAt=new Date().toISOString(); delete job.leaseOwner; delete job.leaseExpiresAt; }); }
  async fail(id: string, message: string): Promise<DurableJob> {
    const job = await this.mutate(id, (item) => { item.error=message; delete item.leaseOwner; delete item.leaseExpiresAt; item.status = item.attempts >= item.maxAttempts ? "dead-letter" : "queued"; item.availableAt = new Date(Date.now() + Math.min(60000, Math.pow(2, item.attempts) * 1000)).toISOString(); });
    if (job.status === "dead-letter") await this.store.writeJson(this.store.path("dead-letter", `${job.id}.json`), job);
    return job;
  }
  async cancel(id: string): Promise<DurableJob> { return this.mutate(id, (job) => { if (["completed","dead-letter"].includes(job.status)) throw new Error("Terminal jobs cannot be cancelled"); job.status="cancelled"; }); }
  async retry(id: string): Promise<DurableJob> { return this.mutate(id, (job) => { job.status="queued"; job.error=undefined; job.availableAt=new Date().toISOString(); }); }

  async recoverExpiredLeases(): Promise<number> {
    let recovered = 0; const now = Date.now();
    for (const job of await this.list()) {
      if (["leased","running"].includes(job.status) && job.leaseExpiresAt && Date.parse(job.leaseExpiresAt) < now) {
        job.status="queued"; delete job.leaseOwner; delete job.leaseExpiresAt; job.updatedAt=new Date().toISOString(); await this.store.writeJson(this.jobPath(job.id), job); recovered++;
      }
    }
    return recovered;
  }

  async metrics(): Promise<Record<string, unknown>> {
    const jobs = await this.list(); const counts: Record<string, number> = {};
    for (const job of jobs) counts[job.status] = (counts[job.status] ?? 0) + 1;
    return { total: jobs.length, counts, durable: true, retryBackoff: true, deadLetter: true, leaseRecovery: true };
  }

  private async mutate(id: string, fn: (job: DurableJob) => void): Promise<DurableJob> {
    const job = await this.get(id); if (!job) throw new Error(`Job not found: ${id}`); fn(job); job.updatedAt = new Date().toISOString(); await this.store.writeJson(this.jobPath(id), job); return job;
  }
}
