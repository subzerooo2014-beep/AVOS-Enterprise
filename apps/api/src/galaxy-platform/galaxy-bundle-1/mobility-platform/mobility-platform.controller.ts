import { Body, Controller, Get, Post } from "@nestjs/common";
import { MobilityPlatformService } from "./mobility-platform.service";
import { MobilityPlatformExecutionRequest } from "./mobility-platform.types";

@Controller("galaxy-platform/mobility-platform")
export class MobilityPlatformController {
  constructor(private readonly service: MobilityPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: MobilityPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}