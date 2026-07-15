import { Body, Controller, Get, Post } from "@nestjs/common";
import { ResiliencePlatformService } from "./resilience-platform.service";
import { ResiliencePlatformExecutionRequest } from "./resilience-platform.types";

@Controller("galaxy-platform/resilience-platform")
export class ResiliencePlatformController {
  constructor(private readonly service: ResiliencePlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: ResiliencePlatformExecutionRequest) {
    return this.service.execute(request);
  }
}