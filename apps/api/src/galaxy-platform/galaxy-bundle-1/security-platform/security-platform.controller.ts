import { Body, Controller, Get, Post } from "@nestjs/common";
import { SecurityPlatformService } from "./security-platform.service";
import { SecurityPlatformExecutionRequest } from "./security-platform.types";

@Controller("galaxy-platform/security-platform")
export class SecurityPlatformController {
  constructor(private readonly service: SecurityPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: SecurityPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}