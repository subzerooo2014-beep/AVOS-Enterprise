import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowServiceLevel } from "./core-flow-enterprise.types";

@Injectable()
export class CoreFlowSlaService {
  private readonly levels = new Map<string, FlowServiceLevel>();

  define(flow: string, targetMs: number, warningMs: number, breachMs: number) {
    const level: FlowServiceLevel = {
      id: `sla_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow,
      targetMs: Math.max(Number(targetMs), 1),
      warningMs: Math.max(Number(warningMs), Number(targetMs)),
      breachMs: Math.max(Number(breachMs), Number(warningMs)),
      createdAt: new Date().toISOString(),
    };
    this.levels.set(flow, level);
    return level;
  }

  find(flow: string) {
    const level = this.levels.get(flow);
    if (!level) throw new NotFoundException("Flow SLA not found");
    return level;
  }

  evaluate(flow: string, durationMs: number) {
    const level = this.find(flow);
    const status =
      durationMs >= level.breachMs
        ? "breached"
        : durationMs >= level.warningMs
          ? "warning"
          : durationMs <= level.targetMs
            ? "healthy"
            : "degraded";

    return {
      flow,
      durationMs,
      status,
      targetMs: level.targetMs,
      warningMs: level.warningMs,
      breachMs: level.breachMs,
      evaluatedAt: new Date().toISOString(),
    };
  }

  list() {
    return Array.from(this.levels.values());
  }
}
