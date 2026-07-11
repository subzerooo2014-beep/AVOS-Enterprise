import { Injectable } from "@nestjs/common";
import { PublisherStatisticsService } from "./publisher-statistics.service";
import { PublisherPerformanceService } from "./publisher-performance.service";
import { PublisherChannelMetricsService } from "./publisher-channel-metrics.service";

@Injectable()
export class PublisherReportService {
  constructor(
    private readonly statistics: PublisherStatisticsService,
    private readonly performance: PublisherPerformanceService,
    private readonly channels: PublisherChannelMetricsService,
  ) {}

  async report() {
    return {
      success: true,
      statistics: await this.statistics.summary(),
      performance: await this.performance.report(),
      channels: await this.channels.summary(),
      generatedAt: new Date(),
    };
  }
}
