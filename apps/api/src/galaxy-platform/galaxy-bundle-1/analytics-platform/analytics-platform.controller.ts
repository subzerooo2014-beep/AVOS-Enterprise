import { Body, Controller, Get, Post } from "@nestjs/common";
import { AnalyticsPlatformService } from "./analytics-platform.service";
import { AnalyticsPlatformExecutionRequest } from "./analytics-platform.types";

@Controller("galaxy-platform/analytics-platform")
export class AnalyticsPlatformController {
  constructor(private readonly service: AnalyticsPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: AnalyticsPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}