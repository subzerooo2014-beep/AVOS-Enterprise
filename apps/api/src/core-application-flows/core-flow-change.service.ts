import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowChangeRequest } from "./core-flow-change.types";

@Injectable()
export class CoreFlowChangeService {
  private readonly changes = new Map<string, FlowChangeRequest>();

  create(dto: any) {
    const change: FlowChangeRequest = {
      id: `change_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow: String(dto?.flow ?? "unknown"),
      title: String(dto?.title ?? "Core flow change"),
      description: String(dto?.description ?? ""),
      requestedBy: String(dto?.requestedBy ?? "system"),
      riskScore: Math.min(Math.max(Number(dto?.riskScore ?? 0), 0), 100),
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    this.changes.set(change.id, change);
    return change;
  }

  findAll(query: any = {}) {
    return Array.from(this.changes.values())
      .filter((item) => !query.status || item.status === query.status)
      .filter((item) => !query.flow || item.flow === query.flow)
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const change = this.changes.get(id);
    if (!change) throw new NotFoundException("Flow change request not found");
    return change;
  }

  markAssessed(id: string) {
    const change = this.findOne(id);
    change.status = "assessed";
    return change;
  }

  approve(id: string) {
    const change = this.findOne(id);
    change.status = "approved";
    return change;
  }

  schedule(id: string) {
    const change = this.findOne(id);
    change.status = "scheduled";
    return change;
  }

  execute(id: string) {
    const change = this.findOne(id);
    change.status = "executed";
    change.executedAt = new Date().toISOString();
    return change;
  }

  rollback(id: string) {
    const change = this.findOne(id);
    change.status = "rolled-back";
    return change;
  }
}
