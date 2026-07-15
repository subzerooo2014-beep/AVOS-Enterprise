import { Body, Controller, Get, Post } from "@nestjs/common";
import { PolicyPlatformService } from "./policy-platform.service";
import { PolicyPlatformExecutionRequest } from "./policy-platform.types";

@Controller("galaxy-platform/policy-platform")
export class PolicyPlatformController {
  constructor(private readonly service: PolicyPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: PolicyPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}