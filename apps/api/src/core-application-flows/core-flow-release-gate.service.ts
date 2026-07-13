import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowReleaseGate } from "./core-flow-change.types";

@Injectable()
export class CoreFlowReleaseGateService {
  private readonly gates = new Map<string, FlowReleaseGate>();

  create(changeId: string, name: string) {
    const gate: FlowReleaseGate = {
      id: `gate_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      changeId,
      name,
      status: "pending",
    };
    this.gates.set(gate.id, gate);
    return gate;
  }

  findAll(changeId?: string) {
    return Array.from(this.gates.values())
      .filter((item) => !changeId || item.changeId === changeId)
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const gate = this.gates.get(id);
    if (!gate) throw new NotFoundException("Release gate not found");
    return gate;
  }

  pass(id: string, reason?: string) {
    const gate = this.findOne(id);
    gate.status = "passed";
    gate.reason = reason;
    gate.evaluatedAt = new Date().toISOString();
    return gate;
  }

  fail(id: string, reason?: string) {
    const gate = this.findOne(id);
    gate.status = "failed";
    gate.reason = reason;
    gate.evaluatedAt = new Date().toISOString();
    return gate;
  }

  waive(id: string, reason?: string) {
    const gate = this.findOne(id);
    gate.status = "waived";
    gate.reason = reason;
    gate.evaluatedAt = new Date().toISOString();
    return gate;
  }

  allPassed(changeId: string) {
    const gates = this.findAll(changeId);
    return {
      changeId,
      ready: gates.length > 0 && gates.every((gate) =>
        ["passed", "waived"].includes(gate.status),
      ),
      gates,
    };
  }
}
