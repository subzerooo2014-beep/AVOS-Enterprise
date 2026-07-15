import { Body, Controller, Get, Post } from "@nestjs/common";
import { OperationsPlatformService } from "./operations-platform.service";
import { OperationsPlatformExecutionRequest } from "./operations-platform.types";

@Controller("galaxy-platform/operations-platform")
export class OperationsPlatformController {
  constructor(private readonly service: OperationsPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: OperationsPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}