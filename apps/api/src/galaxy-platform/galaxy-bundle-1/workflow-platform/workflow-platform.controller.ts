import { Body, Controller, Get, Post } from "@nestjs/common";
import { WorkflowPlatformService } from "./workflow-platform.service";
import { WorkflowPlatformExecutionRequest } from "./workflow-platform.types";

@Controller("galaxy-platform/workflow-platform")
export class WorkflowPlatformController {
  constructor(private readonly service: WorkflowPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: WorkflowPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}