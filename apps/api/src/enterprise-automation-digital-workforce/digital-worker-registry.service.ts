import { Injectable, NotFoundException } from "@nestjs/common";
import type { DigitalWorkerRecord } from "./enterprise-automation-digital-workforce.types";

@Injectable()
export class DigitalWorkerRegistryService {
  private readonly workers = new Map<string, DigitalWorkerRecord>();

  register(
    input: Omit<DigitalWorkerRecord, "createdAt" | "updatedAt">,
  ): DigitalWorkerRecord {
    const existing = this.workers.get(input.id);
    const now = new Date().toISOString();

    const worker: DigitalWorkerRecord = {
      ...input,
      capabilities: [...input.capabilities],
      allowedAutomations: [...input.allowedAutomations],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.workers.set(worker.id, worker);
    return this.clone(worker);
  }

  get(id: string): DigitalWorkerRecord {
    const worker = this.workers.get(id);

    if (!worker) {
      throw new NotFoundException(`Digital worker '${id}' was not found.`);
    }

    return this.clone(worker);
  }

  list(): DigitalWorkerRecord[] {
    return Array.from(this.workers.values()).map((worker) => this.clone(worker));
  }

  count(): number {
    return this.workers.size;
  }

  activeCount(): number {
    return this.list().filter((worker) => worker.status === "ACTIVE").length;
  }

  private clone(worker: DigitalWorkerRecord): DigitalWorkerRecord {
    return {
      ...worker,
      capabilities: [...worker.capabilities],
      allowedAutomations: [...worker.allowedAutomations],
    };
  }
}
