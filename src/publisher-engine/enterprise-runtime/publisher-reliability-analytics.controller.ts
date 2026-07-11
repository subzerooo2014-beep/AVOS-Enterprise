import {
  Controller,
  Get,
  Query,
} from "@nestjs/common";

import { PublisherReliabilityAnalyticsService } from "./publisher-reliability-analytics.service";

@Controller(
  "publisher-engine/enterprise/reliability",
)
export class PublisherReliabilityAnalyticsController {
  constructor(
    private readonly service:
      PublisherReliabilityAnalyticsService,
  ) {}

  @Get("sla")
  sla(
    @Query("dateFrom")
    dateFrom?: string,

    @Query("dateTo")
    dateTo?: string,

    @Query("channel")
    channel?: string,
  ) {
    return this.service.slaReport({
      dateFrom,
      dateTo,
      channel,
    });
  }

  @Get("failures")
  failures(
    @Query("dateFrom")
    dateFrom?: string,

    @Query("dateTo")
    dateTo?: string,

    @Query("channel")
    channel?: string,
  ) {
    return this.service.failureTrends({
      dateFrom,
      dateTo,
      channel,
    });
  }

  @Get("ranking")
  ranking(
    @Query("dateFrom")
    dateFrom?: string,

    @Query("dateTo")
    dateTo?: string,
  ) {
    return this.service.reliabilityRanking({
      dateFrom,
      dateTo,
    });
  }

  @Get("latency")
  latency(
    @Query("dateFrom")
    dateFrom?: string,

    @Query("dateTo")
    dateTo?: string,

    @Query("channel")
    channel?: string,
  ) {
    return this.service.latencyDistribution({
      dateFrom,
      dateTo,
      channel,
    });
  }
}
