import { Body, Controller, Get, Post } from "@nestjs/common";
import { FeaturePlatformService } from "./feature-platform.service";
import { FeaturePlatformExecutionRequest } from "./feature-platform.types";

@Controller("galaxy-platform/feature-platform")
export class FeaturePlatformController {
  constructor(private readonly service: FeaturePlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: FeaturePlatformExecutionRequest) {
    return this.service.execute(request);
  }
}