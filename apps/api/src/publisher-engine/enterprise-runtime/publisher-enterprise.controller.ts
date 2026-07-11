import {
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";

import { PublisherEnterpriseService } from "./publisher-enterprise.service";

@Controller(
  "publisher-engine/enterprise",
)
export class PublisherEnterpriseController {
  constructor(
    private readonly service:
      PublisherEnterpriseService,
  ) {}

  @Get("deliveries")
  deliveries(
    @Query("channel")
    channel?: string,

    @Query("status")
    status?: string,

    @Query("vehicleId")
    vehicleId?: string,

    @Query("correlationId")
    correlationId?: string,

    @Query("dateFrom")
    dateFrom?: string,

    @Query("dateTo")
    dateTo?: string,

    @Query("limit")
    limit?: string,
  ) {
    return this.service.deliveries({
      channel,
      status,
      vehicleId,
      correlationId,
      dateFrom,
      dateTo,

      limit:
        limit
          ? Number(limit)
          : 50,
    });
  }

  @Get("timeline/:eventId")
  timeline(
    @Param("eventId")
    eventId: string,
  ) {
    return this.service.timeline(
      eventId,
    );
  }

  @Get("snapshot/:eventId")
  snapshot(
    @Param("eventId")
    eventId: string,
  ) {
    return this.service.snapshot(
      eventId,
    );
  }

  @Get("analytics")
  analytics() {
    return this.service.analytics();
  }
}
