import { Body, Controller, Get, Post } from "@nestjs/common";
import { DigitalTwinPlatformService } from "./digital-twin-platform.service";
import { DigitalTwinPlatformExecutionRequest } from "./digital-twin-platform.types";

@Controller("galaxy-platform/digital-twin-platform")
export class DigitalTwinPlatformController {
  constructor(private readonly service: DigitalTwinPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: DigitalTwinPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}