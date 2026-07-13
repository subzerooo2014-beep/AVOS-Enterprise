import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  FlowEscalation,
  FlowRiskLevel,
} from "./core-flow-governance.types";

@Injectable()
export class CoreFlowEscalationService {
  private readonly escalations = new Map<string, FlowEscalation>();

  open(
    executionId: string,
    severity: FlowRiskLevel,
    reason: string,
  ) {
    const escalation: FlowEscalation = {
      id: `escalation_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      severity,
      reason,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    this.escalations.set(escalation.id, escalation);
    return escalation;
  }

  findAll(query: any = {}) {
    return Array.from(this.escalations.values())
      .filter((item) => !query.status || item.status === query.status)
      .filter((item) => !query.severity || item.severity === query.severity)
      .filter((item) => !query.executionId || item.executionId === query.executionId)
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const escalation = this.escalations.get(id);
    if (!escalation) throw new NotFoundException("Flow escalation not found");
    return escalation;
  }

  acknowledge(id: string) {
    const escalation = this.findOne(id);
    escalation.status = "acknowledged";
    return escalation;
  }

  resolve(id: string) {
    const escalation = this.findOne(id);
    escalation.status = "resolved";
    escalation.resolvedAt = new Date().toISOString();
    return escalation;
  }

  dashboard() {
    const items = Array.from(this.escalations.values());
    return {
      total: items.length,
      open: items.filter((item) => item.status === "open").length,
      acknowledged: items.filter((item) => item.status === "acknowledged").length,
      resolved: items.filter((item) => item.status === "resolved").length,
      criticalOpen: items.filter(
        (item) => item.status !== "resolved" && item.severity === "critical",
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }
}
