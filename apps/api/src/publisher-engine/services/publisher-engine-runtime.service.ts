import { Injectable } from "@nestjs/common";
import { PublisherRuntimeService } from "./publisher-runtime.service";
import { PublisherDispatchMetricsService } from "./publisher-dispatch-metrics.service";

@Injectable()
export class PublisherEngineRuntimeService {
  constructor(
    private readonly runtime: PublisherRuntimeService,
    private readonly metrics: PublisherDispatchMetricsService,
  ) {}

  async status() {
    return {
      runtime: await this.runtime.runtime(),
      metrics: this.metrics.report(),
      timestamp: new Date(),
    };
  }
}
