import { Body, Controller, Get, Post } from "@nestjs/common";
import { GovernmentPlatformService } from "./government-platform.service";
import { GovernmentPlatformExecutionRequest } from "./government-platform.types";

@Controller("galaxy-platform/government-platform")
export class GovernmentPlatformController {
  constructor(private readonly service: GovernmentPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: GovernmentPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}