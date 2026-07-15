import { Body, Controller, Get, Post } from "@nestjs/common";
import { AutomationPlatformService } from "./automation-platform.service";
import { AutomationPlatformExecutionRequest } from "./automation-platform.types";

@Controller("galaxy-platform/automation-platform")
export class AutomationPlatformController {
  constructor(private readonly service: AutomationPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: AutomationPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}