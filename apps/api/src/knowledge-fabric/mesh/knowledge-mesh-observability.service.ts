import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeMeshObservabilityService {
  private requests = 0;
  private accepted = 0;
  private rejected = 0;
  private routeMisses = 0;

  record(result: { accepted: boolean; routeFound: boolean }): void {
    this.requests += 1;
    if (result.accepted) this.accepted += 1;
    else this.rejected += 1;
    if (!result.routeFound) this.routeMisses += 1;
  }

  snapshot() {
    return {
      requests: this.requests,
      accepted: this.accepted,
      rejected: this.rejected,
      routeMisses: this.routeMisses,
      acceptanceRate: this.requests === 0 ? 100 : Math.round((this.accepted / this.requests) * 100),
      calculatedAt: new Date().toISOString(),
    };
  }
}