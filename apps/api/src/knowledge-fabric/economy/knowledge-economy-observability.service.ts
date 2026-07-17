import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeEconomyObservabilityService {
  private readonly counters = new Map<string, number>();
  increment(metric: string, value = 1): number { const next = (this.counters.get(metric) ?? 0) + value; this.counters.set(metric, next); return next; }
  snapshot(): Record<string, number> { return Object.fromEntries(this.counters.entries()); }
}