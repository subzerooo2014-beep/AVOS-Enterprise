import { Body, Controller, Get, Post } from "@nestjs/common";
import { AiPlatformService } from "./ai-platform.service";
import { AiPlatformExecutionRequest } from "./ai-platform.types";

@Controller("galaxy-platform/ai-platform")
export class AiPlatformController {
  constructor(private readonly service: AiPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: AiPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}