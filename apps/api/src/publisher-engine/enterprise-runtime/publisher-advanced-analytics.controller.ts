import {
  Controller,
  Get,
  Query,
} from "@nestjs/common";

import { PublisherAdvancedAnalyticsService } from "./publisher-advanced-analytics.service";

@Controller(
  "publisher-engine/enterprise/advanced-analytics",
)
export class PublisherAdvancedAnalyticsController {
  constructor(
    private readonly service:
      PublisherAdvancedAnalyticsService,
  ) {}

  @Get("dashboard")
  dashboard(
    @Query("dateFrom")
    dateFrom?: string,

    @Query("dateTo")
    dateTo?: string,

    @Query("channel")
    channel?: string,
  ) {
    return this.service.dashboard({
      dateFrom,
      dateTo,
      channel,
    });
  }

  @Get("kpis")
  kpis(
    @Query("dateFrom")
    dateFrom?: string,

    @Query("dateTo")
    dateTo?: string,
  ) {
    return this.service.kpis({
      dateFrom,
      dateTo,
    });
  }

  @Get("channels")
  channelPerformance(
    @Query("dateFrom")
    dateFrom?: string,

    @Query("dateTo")
    dateTo?: string,
  ) {
    return this.service.channelPerformance({
      dateFrom,
      dateTo,
    });
  }
}
