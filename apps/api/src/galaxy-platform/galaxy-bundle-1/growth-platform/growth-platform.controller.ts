import { Body, Controller, Get, Post } from "@nestjs/common";
import { GrowthPlatformService } from "./growth-platform.service";
import { GrowthPlatformExecutionRequest } from "./growth-platform.types";

@Controller("galaxy-platform/growth-platform")
export class GrowthPlatformController {
  constructor(private readonly service: GrowthPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: GrowthPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}