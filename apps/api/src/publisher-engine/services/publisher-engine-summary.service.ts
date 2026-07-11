import { Injectable } from "@nestjs/common";
import { PublisherEngineMetricsService } from "./publisher-engine-metrics.service";
import { PublisherReadyService } from "./publisher-ready.service";

@Injectable()
export class PublisherEngineSummaryService {
  constructor(
    private readonly metrics: PublisherEngineMetricsService,
    private readonly ready: PublisherReadyService,
  ) {}

  async summary() {
    return {
      ready: this.ready.ready(),
      metrics: await this.metrics.metrics(),
      generatedAt: new Date(),
    };
  }
}
