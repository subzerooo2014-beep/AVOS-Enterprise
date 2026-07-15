import { Body, Controller, Get, Post } from "@nestjs/common";
import { KnowledgePlatformService } from "./knowledge-platform.service";
import { KnowledgePlatformExecutionRequest } from "./knowledge-platform.types";

@Controller("galaxy-platform/knowledge-platform")
export class KnowledgePlatformController {
  constructor(private readonly service: KnowledgePlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: KnowledgePlatformExecutionRequest) {
    return this.service.execute(request);
  }
}