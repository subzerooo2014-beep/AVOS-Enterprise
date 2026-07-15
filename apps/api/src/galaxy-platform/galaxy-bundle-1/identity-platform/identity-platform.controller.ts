import { Body, Controller, Get, Post } from "@nestjs/common";
import { IdentityPlatformService } from "./identity-platform.service";
import { IdentityPlatformExecutionRequest } from "./identity-platform.types";

@Controller("galaxy-platform/identity-platform")
export class IdentityPlatformController {
  constructor(private readonly service: IdentityPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: IdentityPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}