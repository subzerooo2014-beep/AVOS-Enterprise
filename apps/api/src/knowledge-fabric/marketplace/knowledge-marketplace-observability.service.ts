import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeMarketplaceObservabilityService {
  private readonly counters = new Map<string, number>();
  increment(metric: string, amount = 1): void { this.counters.set(metric, (this.counters.get(metric) ?? 0) + amount); }
  snapshot(): Record<string, number> { return Object.fromEntries(this.counters.entries()); }
}