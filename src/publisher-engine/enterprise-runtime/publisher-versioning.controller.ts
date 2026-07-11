import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { PublisherVersioningService } from "./publisher-versioning.service";

@Controller(
  "publisher-engine/enterprise/versions",
)
export class PublisherVersioningController {
  constructor(
    private readonly service:
      PublisherVersioningService,
  ) {}

  @Post(":eventId")
  createVersion(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      reason?: string;
      content?: any;
      campaign?: any;
      metadata?: any;
    },
  ) {
    return this.service.createVersion(
      eventId,
      body,
    );
  }

  @Get(":eventId")
  versions(
    @Param("eventId")
    eventId: string,
  ) {
    return this.service.versions(
      eventId,
    );
  }

  @Get(":eventId/:version")
  version(
    @Param("eventId")
    eventId: string,

    @Param("version")
    version: string,
  ) {
    return this.service.version(
      eventId,
      Number(version),
    );
  }

  @Get(":eventId/compare/result")
  compare(
    @Param("eventId")
    eventId: string,

    @Query("left")
    left: string,

    @Query("right")
    right: string,
  ) {
    return this.service.compare(
      eventId,
      Number(left),
      Number(right),
    );
  }

  @Post(":eventId/restore/:version")
  restore(
    @Param("eventId")
    eventId: string,

    @Param("version")
    version: string,

    @Body()
    body?: {
      reason?: string;
    },
  ) {
    return this.service.restore(
      eventId,
      Number(version),
      body?.reason,
    );
  }

  @Get(":eventId/restores/history")
  restoreHistory(
    @Param("eventId")
    eventId: string,
  ) {
    return this.service.restoreHistory(
      eventId,
    );
  }
}
