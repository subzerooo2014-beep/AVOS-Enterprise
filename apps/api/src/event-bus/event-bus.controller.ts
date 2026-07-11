import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { EventBusService } from "./event-bus.service";

@Controller("event-bus")
export class EventBusController {
  constructor(private service: EventBusService) {}

  @Post("emit")
  emit(@Body() body: any) {
    return this.service.emit(body);
  }

  @Get("events")
  list(@Query("status") status?: string) {
    return this.service.list(status);
  }

  @Patch("events/:id/processed")
  processed(@Param("id") id: string, @Body() body: any) {
    return this.service.markProcessed(id, body);
  }
}
