import { Body, Controller, Get, Post } from "@nestjs/common";
import { GlobalOperationsService } from "./global-operations.service";
import { GlobalOperationsExecutionRequest } from "./global-operations.types";

@Controller("galaxy-platform/global-operations")
export class GlobalOperationsController {
  constructor(private readonly service: GlobalOperationsService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: GlobalOperationsExecutionRequest) {
    return this.service.execute(request);
  }
}