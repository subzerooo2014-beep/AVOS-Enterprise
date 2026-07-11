import { Injectable } from "@nestjs/common";
import { PublisherDispatchMetricsService } from "./publisher-dispatch-metrics.service";
import { PublisherChannelMetricsService } from "./publisher-channel-metrics.service";
import { PublisherWorkerMetricsService } from "./publisher-worker-metrics.service";

@Injectable()
export class PublisherEngineMetricsService {
  constructor(
    private readonly dispatch: PublisherDispatchMetricsService,
    private readonly channels: PublisherChannelMetricsService,
    private readonly workers: PublisherWorkerMetricsService,
  ) {}

  async metrics() {
    return {
      dispatch: this.dispatch.report(),
      channels: await this.channels.summary(),
      workers: await this.workers.summary(),
      generatedAt: new Date(),
    };
  }
}
