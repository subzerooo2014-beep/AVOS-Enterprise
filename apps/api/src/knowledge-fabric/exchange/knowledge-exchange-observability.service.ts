import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeExchangeObservabilityService {
  private requests = 0;
  private accepted = 0;
  private rejected = 0;
  private offerMisses = 0;

  record(result: { accepted: boolean; offerFound: boolean }): void {
    this.requests += 1;
    if (result.accepted) this.accepted += 1;
    else this.rejected += 1;
    if (!result.offerFound) this.offerMisses += 1;
  }

  snapshot() {
    return {
      requests: this.requests,
      accepted: this.accepted,
      rejected: this.rejected,
      offerMisses: this.offerMisses,
      acceptanceRate: this.requests === 0 ? 100 : Math.round((this.accepted / this.requests) * 100),
      calculatedAt: new Date().toISOString(),
    };
  }
}