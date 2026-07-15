import { Body, Controller, Get, Post } from "@nestjs/common";
import { TrustPlatformService } from "./trust-platform.service";
import { TrustPlatformExecutionRequest } from "./trust-platform.types";

@Controller("galaxy-platform/trust-platform")
export class TrustPlatformController {
  constructor(private readonly service: TrustPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: TrustPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}