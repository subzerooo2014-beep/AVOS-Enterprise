import { Body, Controller, Get, Post } from "@nestjs/common";
import { MediaPlatformService } from "./media-platform.service";
import { MediaPlatformExecutionRequest } from "./media-platform.types";

@Controller("galaxy-platform/media-platform")
export class MediaPlatformController {
  constructor(private readonly service: MediaPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: MediaPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}