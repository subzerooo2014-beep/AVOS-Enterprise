import { Body, Controller, Get, Post } from "@nestjs/common";
import { InnovationPlatformService } from "./innovation-platform.service";
import { InnovationPlatformExecutionRequest } from "./innovation-platform.types";

@Controller("galaxy-platform/innovation-platform")
export class InnovationPlatformController {
  constructor(private readonly service: InnovationPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: InnovationPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}