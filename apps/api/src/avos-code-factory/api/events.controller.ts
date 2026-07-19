import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { FactoryEventBusService } from "../events/event-bus.service";

@Controller("avos/code-factory/events")
export class FactoryEventsController {
  constructor(private readonly events: FactoryEventBusService) {}

  @Get()
  history(
    @Query("limit") limit?: string,
    @Query("type") type?: string,
  ) {
    const parsedLimit = limit ? Number(limit) : 100;
    return this.events.history(
      Number.isFinite(parsedLimit) ? parsedLimit : 100,
      type,
    );
  }

  @Get("summary")
  summary() {
    return this.events.summary();
  }

  @Post()
  publish(
    @Body()
    body: {
      type: string;
      source?: string;
      subject?: string;
      payload?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    },
  ) {
    if (!body.type?.trim()) {
      throw new Error("Event type is required.");
    }

    return this.events.publish(
      body.type,
      body.source?.trim() || "factory-api",
      body.payload ?? {},
      {
        subject: body.subject,
        metadata: body.metadata,
      },
    );
  }
}
