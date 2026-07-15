import { Body, Controller, Get, Post } from "@nestjs/common";
import { ObservabilityPlatformService } from "./observability-platform.service";
import { ObservabilityPlatformExecutionRequest } from "./observability-platform.types";

@Controller("galaxy-platform/observability-platform")
export class ObservabilityPlatformController {
  constructor(private readonly service: ObservabilityPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: ObservabilityPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}