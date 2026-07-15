import { Body, Controller, Get, Post } from "@nestjs/common";
import { ContentPlatformService } from "./content-platform.service";
import { ContentPlatformExecutionRequest } from "./content-platform.types";

@Controller("galaxy-platform/content-platform")
export class ContentPlatformController {
  constructor(private readonly service: ContentPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: ContentPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}