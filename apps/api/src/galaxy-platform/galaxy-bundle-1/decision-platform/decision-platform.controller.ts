import { Body, Controller, Get, Post } from "@nestjs/common";
import { DecisionPlatformService } from "./decision-platform.service";
import { DecisionPlatformExecutionRequest } from "./decision-platform.types";

@Controller("galaxy-platform/decision-platform")
export class DecisionPlatformController {
  constructor(private readonly service: DecisionPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: DecisionPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}