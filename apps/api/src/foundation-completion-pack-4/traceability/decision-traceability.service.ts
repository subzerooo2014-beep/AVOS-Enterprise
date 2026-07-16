import { Injectable, NotFoundException } from "@nestjs/common";
import { DecisionTraceRecord } from "../foundation-pack-4.types";

@Injectable()
export class DecisionTraceabilityService {
  private readonly traces = new Map<string, DecisionTraceRecord>();

  list() {
    return Array.from(this.traces.values());
  }

  get(id: string) {
    const trace = this.traces.get(id);

    if (!trace) {
      throw new NotFoundException(`Decision trace not found: ${id}`);
    }

    return trace;
  }

  register(
    input: Omit<DecisionTraceRecord, "id" | "createdAt">
  ) {
    const id = `decision-trace:${Date.now()}`;

    const trace: DecisionTraceRecord = {
      ...input,
      id,
      childDecisionIds: Array.from(new Set(input.childDecisionIds)),
      createdAt: new Date().toISOString()
    };

    this.traces.set(id, trace);
    return trace;
  }

  chain(decisionId: string) {
    const items = this.list().filter(
      (trace) =>
        trace.decisionId === decisionId ||
        trace.parentDecisionId === decisionId ||
        trace.childDecisionIds.includes(decisionId)
    );

    return {
      decisionId,
      total: items.length,
      items: items.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    };
  }

  summary() {
    return {
      total: this.traces.size,
      correlated: this.list().filter((trace) => Boolean(trace.correlationId))
        .length
    };
  }
}
