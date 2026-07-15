import { Body, Controller, Get, Post } from "@nestjs/common";
import { DataPlatformService } from "./data-platform.service";
import { DataPlatformExecutionRequest } from "./data-platform.types";

@Controller("galaxy-platform/data-platform")
export class DataPlatformController {
  constructor(private readonly service: DataPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: DataPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}