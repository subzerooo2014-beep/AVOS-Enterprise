import { Body, Controller, Get, Post } from "@nestjs/common";
import { DeveloperPlatformService } from "./developer-platform.service";
import { DeveloperPlatformExecutionRequest } from "./developer-platform.types";

@Controller("galaxy-platform/developer-platform")
export class DeveloperPlatformController {
  constructor(private readonly service: DeveloperPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: DeveloperPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}