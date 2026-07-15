import { Body, Controller, Get, Post } from "@nestjs/common";
import { EventPlatformService } from "./event-platform.service";
import { EventPlatformExecutionRequest } from "./event-platform.types";

@Controller("galaxy-platform/event-platform")
export class EventPlatformController {
  constructor(private readonly service: EventPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: EventPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}