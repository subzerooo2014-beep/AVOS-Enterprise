import { Body, Controller, Get, Post } from "@nestjs/common";
import { RevenuePlatformService } from "./revenue-platform.service";
import { RevenuePlatformExecutionRequest } from "./revenue-platform.types";

@Controller("galaxy-platform/revenue-platform")
export class RevenuePlatformController {
  constructor(private readonly service: RevenuePlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: RevenuePlatformExecutionRequest) {
    return this.service.execute(request);
  }
}