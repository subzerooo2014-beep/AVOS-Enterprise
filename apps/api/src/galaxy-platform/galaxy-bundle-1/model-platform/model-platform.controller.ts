import { Body, Controller, Get, Post } from "@nestjs/common";
import { ModelPlatformService } from "./model-platform.service";
import { ModelPlatformExecutionRequest } from "./model-platform.types";

@Controller("galaxy-platform/model-platform")
export class ModelPlatformController {
  constructor(private readonly service: ModelPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: ModelPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}