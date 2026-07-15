import { Body, Controller, Get, Post } from "@nestjs/common";
import { StreamingPlatformService } from "./streaming-platform.service";
import { StreamingPlatformExecutionRequest } from "./streaming-platform.types";

@Controller("galaxy-platform/streaming-platform")
export class StreamingPlatformController {
  constructor(private readonly service: StreamingPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: StreamingPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}