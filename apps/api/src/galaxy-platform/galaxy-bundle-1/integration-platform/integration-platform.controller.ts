import { Body, Controller, Get, Post } from "@nestjs/common";
import { IntegrationPlatformService } from "./integration-platform.service";
import { IntegrationPlatformExecutionRequest } from "./integration-platform.types";

@Controller("galaxy-platform/integration-platform")
export class IntegrationPlatformController {
  constructor(private readonly service: IntegrationPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: IntegrationPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}