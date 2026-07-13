import { Injectable, NotFoundException } from "@nestjs/common";
import type { RuntimeFlowRegistration, RuntimeFlowStatus } from "./core-flow-runtime.types";

@Injectable()
export class CoreFlowRuntimeRegistryService {
  private readonly items = new Map<string, RuntimeFlowRegistration>();

  register(dto: any) {
    const existing = Array.from(this.items.values()).find(
      (item) => item.flow === dto?.flow && item.version === dto?.version,
    );
    if (existing) return existing;

    const now = new Date().toISOString();
    const item: RuntimeFlowRegistration = {
      id: `runtime_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow: String(dto?.flow ?? "unknown"),
      version: String(dto?.version ?? "1.0.0"),
      owner: String(dto?.owner ?? "avos"),
      region: String(dto?.region ?? "global"),
      capabilities: Array.isArray(dto?.capabilities) ? dto.capabilities.map(String) : [],
      status: "registered",
      createdAt: now,
      updatedAt: now,
    };
    this.items.set(item.id, item);
    return item;
  }

  findAll(query: any = {}) {
    return Array.from(this.items.values())
      .filter((item) => !query.status || item.status === query.status)
      .filter((item) => !query.region || item.region === query.region)
      .filter((item) => !query.flow || item.flow === query.flow)
      .slice().reverse();
  }

  findOne(id: string) {
    const item = this.items.get(id);
    if (!item) throw new NotFoundException("Runtime flow registration not found");
    return item;
  }

  setStatus(id: string, status: RuntimeFlowStatus) {
    const item = this.findOne(id);
    item.status = status;
    item.updatedAt = new Date().toISOString();
    return item;
  }

  stats() {
    const items = Array.from(this.items.values());
    const count = (status: RuntimeFlowStatus) => items.filter((item) => item.status === status).length;
    return {
      total: items.length,
      registered: count("registered"),
      active: count("active"),
      degraded: count("degraded"),
      paused: count("paused"),
      retired: count("retired"),
      generatedAt: new Date().toISOString(),
    };
  }
}
