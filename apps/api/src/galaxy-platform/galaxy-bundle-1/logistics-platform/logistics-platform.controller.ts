import { Body, Controller, Get, Post } from "@nestjs/common";
import { LogisticsPlatformService } from "./logistics-platform.service";
import { LogisticsPlatformExecutionRequest } from "./logistics-platform.types";

@Controller("galaxy-platform/logistics-platform")
export class LogisticsPlatformController {
  constructor(private readonly service: LogisticsPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: LogisticsPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}