import { Injectable, NotFoundException } from "@nestjs/common";

export type FlowRegistryEntry = {
  id: string;
  flow: string;
  correlationId: string;
  status: "running" | "completed" | "failed";
  input: Record<string, unknown>;
  output?: unknown;
  error?: string;
  startedAt: string;
  completedAt?: string;
  attempts: number;
};

@Injectable()
export class CoreFlowRegistryService {
  private readonly entries = new Map<string, FlowRegistryEntry>();

  start(flow: string, correlationId: string, input: Record<string, unknown>) {
    const existing = Array.from(this.entries.values()).find(
      (entry) => entry.flow === flow && entry.correlationId === correlationId,
    );
    if (existing) return existing;

    const entry: FlowRegistryEntry = {
      id: `flow_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow,
      correlationId,
      status: "running",
      input,
      startedAt: new Date().toISOString(),
      attempts: 1,
    };
    this.entries.set(entry.id, entry);
    return entry;
  }

  complete(id: string, output: unknown) {
    const entry = this.findOne(id);
    entry.status = "completed";
    entry.output = output;
    entry.completedAt = new Date().toISOString();
    return entry;
  }

  fail(id: string, error: unknown) {
    const entry = this.findOne(id);
    entry.status = "failed";
    entry.error = error instanceof Error ? error.message : String(error);
    entry.completedAt = new Date().toISOString();
    return entry;
  }

  retry(id: string) {
    const entry = this.findOne(id);
    entry.status = "running";
    entry.error = undefined;
    entry.completedAt = undefined;
    entry.attempts += 1;
    return entry;
  }

  findAll(query: any = {}) {
    return Array.from(this.entries.values())
      .filter((entry) => !query.status || entry.status === query.status)
      .filter((entry) => !query.flow || entry.flow === query.flow)
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const entry = this.entries.get(id);
    if (!entry) throw new NotFoundException("Core flow execution not found");
    return entry;
  }

  dashboard() {
    const entries = Array.from(this.entries.values());
    const completed = entries.filter((entry) => entry.status === "completed").length;
    const failed = entries.filter((entry) => entry.status === "failed").length;
    const running = entries.filter((entry) => entry.status === "running").length;

    return {
      total: entries.length,
      completed,
      failed,
      running,
      successRate: entries.length
        ? Number(((completed / entries.length) * 100).toFixed(2))
        : 100,
      generatedAt: new Date().toISOString(),
    };
  }
}
