import { Body, Controller, Get, Post } from "@nestjs/common";
import { PartnerPlatformService } from "./partner-platform.service";
import { PartnerPlatformExecutionRequest } from "./partner-platform.types";

@Controller("galaxy-platform/partner-platform")
export class PartnerPlatformController {
  constructor(private readonly service: PartnerPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: PartnerPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}