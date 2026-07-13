import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import type { ApprovalGate } from "./core-flow-process-manager.types";

@Injectable()
export class CoreFlowApprovalService {
  private readonly gates = new Map<string, ApprovalGate>();

  request(executionId: string, nodeId: string) {
    const existing = Array.from(this.gates.values()).find(
      (gate) =>
        gate.executionId === executionId &&
        gate.nodeId === nodeId &&
        gate.status === "pending",
    );
    if (existing) return existing;

    const gate: ApprovalGate = {
      id: `approval_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      nodeId,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };
    this.gates.set(gate.id, gate);
    return gate;
  }

  findAll(query: any = {}) {
    return Array.from(this.gates.values())
      .filter((gate) => !query.status || gate.status === query.status)
      .filter((gate) => !query.executionId || gate.executionId === query.executionId)
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const gate = this.gates.get(id);
    if (!gate) throw new NotFoundException("Approval gate not found");
    return gate;
  }

  approve(id: string, actor: string, reason?: string) {
    const gate = this.findOne(id);
    if (gate.status !== "pending") {
      throw new ConflictException("Approval gate is already decided.");
    }
    gate.status = "approved";
    gate.decidedAt = new Date().toISOString();
    gate.decidedBy = actor;
    gate.reason = reason;
    return gate;
  }

  reject(id: string, actor: string, reason?: string) {
    const gate = this.findOne(id);
    if (gate.status !== "pending") {
      throw new ConflictException("Approval gate is already decided.");
    }
    gate.status = "rejected";
    gate.decidedAt = new Date().toISOString();
    gate.decidedBy = actor;
    gate.reason = reason;
    return gate;
  }
}
