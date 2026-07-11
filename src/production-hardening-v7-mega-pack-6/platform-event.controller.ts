import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { PublishPlatformEventDto } from "./dto/publish-platform-event.dto";
import { PlatformEventBusService } from "./platform-event-bus.service";
import {
  PlatformEvent,
} from "./types/mega-pack-6.types";

@Controller(
  "production-hardening-v7/mega-pack-6/events",
)
export class PlatformEventController {
  constructor(
    private readonly events:
      PlatformEventBusService,
  ) {}

  @Post()
  publish(
    @Body()
    dto: PublishPlatformEventDto,
  ) {
    return this.events.publish(dto);
  }

  @Get()
  list(
    @Query("status")
    status?:
      PlatformEvent["processingStatus"],
    @Query("eventType")
    eventType?: string,
  ) {
    return this.events.list(
      status,
      eventType,
    );
  }

  @Patch(":id/processing")
  markProcessing(
    @Param("id")
    id: string,
  ) {
    return this.events
      .markProcessing(id);
  }

  @Patch(":id/processed")
  markProcessed(
    @Param("id")
    id: string,
  ) {
    return this.events
      .markProcessed(id);
  }

  @Patch(":id/failed")
  markFailed(
    @Param("id")
    id: string,
    @Body()
    body: {
      errorMessage: string;
    },
  ) {
    return this.events.markFailed(
      id,
      body.errorMessage,
    );
  }
}
