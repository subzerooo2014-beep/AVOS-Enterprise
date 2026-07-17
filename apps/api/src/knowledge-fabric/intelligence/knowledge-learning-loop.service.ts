import { Injectable } from "@nestjs/common";
import { KnowledgeLearningSignal } from "./knowledge-intelligence.contracts";

@Injectable()
export class KnowledgeLearningLoopService {
  private readonly signals: Array<KnowledgeLearningSignal & { recordedAt: string }> = [];
  record(signal: KnowledgeLearningSignal) {
    const entry = { ...signal, recordedAt: new Date().toISOString() };
    this.signals.unshift(entry);
    if (this.signals.length > 1000) this.signals.length = 1000;
    return entry;
  }
  list(limit = 100) { return this.signals.slice(0, Math.max(1, Math.min(limit, 1000))); }
  summary() {
    const total = this.signals.length;
    const successful = this.signals.filter((x) => x.outcome === "SUCCESS").length;
    return { total, successful, successRate: total ? Number((successful / total).toFixed(4)) : 0 };
  }
}