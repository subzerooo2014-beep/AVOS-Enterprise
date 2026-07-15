import { Body, Controller, Get, Post } from "@nestjs/common";
import { AgentPlatformService } from "./agent-platform.service";
import { AgentPlatformExecutionRequest } from "./agent-platform.types";

@Controller("galaxy-platform/agent-platform")
export class AgentPlatformController {
  constructor(private readonly service: AgentPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: AgentPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}