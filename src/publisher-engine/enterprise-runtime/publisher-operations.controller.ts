import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";

import { PublisherOperationsService } from "./publisher-operations.service";

@Controller(
  "publisher-engine/enterprise/operations",
)
export class PublisherOperationsController {
  constructor(
    private readonly service:
      PublisherOperationsService,
  ) {}

  @Post("cancel/:eventId")
  cancel(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      reason?: string;
    },
  ) {
    return this.service.cancel(
      eventId,
      body?.reason,
    );
  }

  @Post("retry/:eventId")
  retry(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      reason?: string;
    },
  ) {
    return this.service.retry(
      eventId,
      body?.reason,
    );
  }

  @Post("retry-now/:eventId")
  retryNow(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      reason?: string;
    },
  ) {
    return this.service.retryNow(
      eventId,
      body?.reason,
    );
  }

  @Post("clone/:eventId")
  clone(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      content?: any;
      campaign?: any;
      metadata?: any;
    },
  ) {
    return this.service.clone(
      eventId,
      body,
    );
  }

  @Post("replay/:eventId")
  replay(
    @Param("eventId")
    eventId: string,

    @Body()
    body?: {
      content?: any;
      campaign?: any;
      metadata?: any;
    },
  ) {
    return this.service.replay(
      eventId,
      body,
    );
  }

  @Get("history/:eventId")
  history(
    @Param("eventId")
    eventId: string,
  ) {
    return this.service.operationHistory(
      eventId,
    );
  }
}
