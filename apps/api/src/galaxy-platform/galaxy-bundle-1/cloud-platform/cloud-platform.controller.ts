import { Body, Controller, Get, Post } from "@nestjs/common";
import { CloudPlatformService } from "./cloud-platform.service";
import { CloudPlatformExecutionRequest } from "./cloud-platform.types";

@Controller("galaxy-platform/cloud-platform")
export class CloudPlatformController {
  constructor(private readonly service: CloudPlatformService) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: CloudPlatformExecutionRequest) {
    return this.service.execute(request);
  }
}