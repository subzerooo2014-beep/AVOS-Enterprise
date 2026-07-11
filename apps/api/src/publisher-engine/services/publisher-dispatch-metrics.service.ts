import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherDispatchMetricsService {
  private dispatched = 0;
  private failed = 0;

  success() {
    this.dispatched++;
  }

  failure() {
    this.failed++;
  }

  report() {
    return {
      dispatched: this.dispatched,
      failed: this.failed,
      generatedAt: new Date(),
    };
  }
}
