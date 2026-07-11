import { Injectable } from "@nestjs/common";
import { PublisherStatisticsService } from "./publisher-statistics.service";
import { PublisherPerformanceService } from "./publisher-performance.service";
import { PublisherChannelMetricsService } from "./publisher-channel-metrics.service";
import { PublisherWorkerMetricsService } from "./publisher-worker-metrics.service";

@Injectable()
export class PublisherDashboardV2Service {
  constructor(
    private readonly statistics: PublisherStatisticsService,
    private readonly performance: PublisherPerformanceService,
    private readonly channels: PublisherChannelMetricsService,
    private readonly workers: PublisherWorkerMetricsService,
  ) {}

  async dashboard() {
    return {
      success: true,
      statistics: await this.statistics.summary(),
      performance: await this.performance.report(),
      channels: await this.channels.summary(),
      workers: await this.workers.summary(),
      generatedAt: new Date(),
    };
  }
}
