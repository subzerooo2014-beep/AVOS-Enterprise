import { Body, Controller, Get, Post } from "@nestjs/common";
import { GovernancePlatformService } from "./governance-platform.service";
import { GovernancePlatformExecutionRequest } from "./governance-platform.types";

@Controller("galaxy-platform/governance-platform")
export class GovernancePlatformController {
  constructor(private readonly service: GovernancePlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: GovernancePlatformExecutionRequest) {
    return this.service.execute(request);
  }
}